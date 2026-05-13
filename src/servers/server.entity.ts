import { Channel } from '../channels/channel.entity';
import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, length: 255 })
  description: string;

  // Modificado para permitir servidores sin dueño en esta primera fase sin autenticación
  @ManyToOne(() => User, (user) => user.servers, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  owner: User;

  @OneToMany(() => Channel, (channel) => channel.server)
  channels: Channel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
