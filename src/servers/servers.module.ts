import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server])],
})
export class ServersModule {}
