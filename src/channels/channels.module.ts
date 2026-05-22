import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ServersModule } from '../servers/servers.module';
import { Channel } from './channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
  // Importamos el repositorio de Channel y el módulo de Servers para poder usar ServersService
  imports: [TypeOrmModule.forFeature([Channel]), ServersModule, AuthModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
