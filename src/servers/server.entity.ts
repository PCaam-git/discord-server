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

  // Se mantiene nullable porque existen datos iniciales creados antes de añadir autenticación.
  // Los nuevos servidores se crean asignando el usuario autenticado como propietario.
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
