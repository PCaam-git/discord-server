import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServersService } from '../servers/servers.service';
import { Channel } from './channel.entity';

// ── Tipos de datos para creación y actualización ──
type CreateChannelData = {
  name: string;
  type?: string;
};

// Para actualización, todos los campos son opcionales
type UpdateChannelData = Partial<CreateChannelData>;

// -- Servicio para gestión de canales --
@Injectable()
export class ChannelsService {
  constructor(
    // Inyección del repositorio de canales y del servicio de servidores
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    private readonly serversService: ServersService,
  ) {}

  // -- Consultas básicas --

  // Obtener todos los canales de un servidor específico
  findAllByServer(serverId: number): Promise<Channel[]> {
    return this.channelsRepository.find({
      where: { server: { id: serverId } },
      relations: ['server'],
      order: { id: 'ASC' },
    });
  }

  // Obtener un canal por su ID, incluyendo su servidor y mensajes relacionados
  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { id },
      relations: ['server', 'messages'],
    });

    if (!channel) {
      throw new NotFoundException(`Canal con id ${id} no encontrado`);
    }

    return channel;
  }

  // -- QueryBuilder: canales con nombre o tipo coincidente --
  search(query: string): Promise<Channel[]> {
    return this.channelsRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.server', 'server')
      .where('(channel.name ILIKE :q OR channel.type ILIKE :q)', {
        q: `%${query}%`,
      })
      .orderBy('channel.name', 'ASC')
      .getMany();
  }

  // -- Peticiones: crear, editar, eliminar --

  // Crear un nuevo canal dentro de un servidor específico
  // Create recibe el ID del servidor. Comprueba que el servidor existe usando ServersService
  async create(serverId: number, data: CreateChannelData): Promise<Channel> {
    const server = await this.serversService.findOne(serverId);

    try {
      const channel = this.channelsRepository.create({
        name: data.name,
        type: data.type ?? 'text',
        server,
      });

      return await this.channelsRepository.save(channel);
    } catch {
      throw new InternalServerErrorException('Error al crear el canal');
    }
  }

  // Actualizar un canal existente por su ID
  async update(id: number, data: UpdateChannelData): Promise<Channel> {
    await this.findOne(id);
    await this.channelsRepository.update(id, data);
    return this.findOne(id);
  }

  // Eliminar un canal por su ID
  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.channelsRepository.delete(id);
  }
}
