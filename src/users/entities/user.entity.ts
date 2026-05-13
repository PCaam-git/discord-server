import { Message } from '../../messages/entities/message.entity';
import { Server } from '../../servers/entities/server.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Server, (server) => server.owner)
  servers: Server[];

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
