import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // ── Consultas básicas ──
  findAll(username?: string): Promise<User[]> {
    if (username) {
      return this.usersRepository.find({
        where: { username },
        order: { username: 'ASC' },
      });
    }
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  // ── QueryBuilder: usuarios con username o email coincidente ──
  search(query: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('(user.username ILIKE :q OR user.email ILIKE :q)', {
        q: `%${query}%`,
      })
      .orderBy('user.username', 'ASC')
      .getMany();
  }

  // ── Mutaciones ──
  async create(data: Partial<User>): Promise<User> {
    try {
      const user = this.usersRepository.create(data);
      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      const databaseError = error as { code?: string };

      if (databaseError.code === '23505') {
        throw new ConflictException('El email ya está registrado');
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.findOne(id); // si no existe, lanza NotFoundException
    await this.usersRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usersRepository.delete(id);
  }
}
