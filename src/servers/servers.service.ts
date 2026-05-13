import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private readonly serversRepository: Repository<Server>,
  ) {}

  // ── Consultas básicas ───

  // Se filtra por nombre o se devuelven todos los servidores ordenados por id
  findAll(name?: string): Promise<Server[]> {
    if (name) {
      return this.serversRepository.find({
        where: { name },
        order: { name: 'ASC' },
      });
    }

    return this.serversRepository.find({
      order: { id: 'ASC' },
    });
  }

  // Se busca por id, incluyendo relaciones con owner y channels
  async findOne(id: number): Promise<Server> {
    const server = await this.serversRepository.findOne({
      where: { id },
      relations: ['owner', 'channels'],
    });

    if (!server) {
      throw new NotFoundException(`Servidor con id ${id} no encontrado`);
    }
    return server;
  }

  // ── QueryBuilder: servidores con nombre o descripción coincidente ──
  search(query: string): Promise<Server[]> {
    return (
      this.serversRepository
        .createQueryBuilder('server')
        // El operador ILIKE es para búsquedas insensibles a mayúsculas en PostgreSQL
        .where('(server.name ILIKE :q OR server.description ILIKE :q)', {
          q: `%${query}%`,
        })
        .orderBy('server.name', 'ASC')
        .getMany()
    );
  }

  // ── Mutaciones ───
  async create(data: Partial<Server>): Promise<Server> {
    try {
      // Verificar si ya existe un servidor con el mismo nombre para evitar duplicados
      const server = this.serversRepository.create(data);
      return await this.serversRepository.save(server);
    } catch {
      throw new InternalServerErrorException('Error al crear el servidor');
    }
  }

  // Se actualiza solo el nombre o la descripción, no el owner ni las channels
  async update(id: number, data: Partial<Server>): Promise<Server> {
    await this.findOne(id);
    await this.serversRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.serversRepository.delete(id);
  }
}
