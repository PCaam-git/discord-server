import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelsService } from '../channels/channels.service';
import { UsersService } from '../users/users.service';
import { Message } from './message.entity';

type CreateMessageData = {
  content: string;
};

type UpdateMessageData = Partial<{
  content: string;
}>;

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
  ) {}

  // -- Consultas básicas --
  findAllByChannel(channelId: number): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { channel: { id: channelId } },
      relations: ['author', 'channel'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['author', 'channel'],
    });

    if (!message) {
      throw new NotFoundException(`Mensaje con id ${id} no encontrado`);
    }

    return message;
  }

  // -- QueryBuilder: busqueda --
  search(query: string): Promise<Message[]> {
    return this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.author', 'author')
      .leftJoinAndSelect('message.channel', 'channel')
      .where('message.content ILIKE :query', {
        query: `%${query}%`,
      })
      .orderBy('message.id', 'ASC')
      .getMany();
  }

  // -- Operaciones de creación, actualización y eliminación --
  async create(
    channelId: number,
    data: CreateMessageData | undefined,
    authorId: number,
  ): Promise<Message> {
    if (!data) {
      throw new BadRequestException(
        'Completar el body de la petición es obligatorio',
      );
    }

    if (!data.content) {
      throw new BadRequestException('El campo content es obligatorio');
    }

    const channel = await this.channelsService.findOne(channelId);
    const author = await this.usersService.findOne(authorId);

    try {
      const message = this.messagesRepository.create({
        content: data.content,
        channel,
        author,
      });

      return await this.messagesRepository.save(message);
    } catch {
      throw new InternalServerErrorException('Error al crear el mensaje');
    }
  }

  async update(id: number, data: UpdateMessageData): Promise<Message> {
    await this.findOne(id);

    await this.messagesRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.messagesRepository.delete(id);
  }
}
