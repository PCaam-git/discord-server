import { Channel } from '../../channels/entities/channel.entity';
import { User } from '../../users/entities/user.entity';
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

  @ManyToOne(() => User, (user) => user.servers, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Channel, (channel) => channel.server)
  channels: Channel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
