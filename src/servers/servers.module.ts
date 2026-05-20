import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Server } from './server.entity';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  // Importa el repositorio de Server para poder usar ServersService
  imports: [TypeOrmModule.forFeature([Server]), AuthModule],
  controllers: [ServersController],
  providers: [ServersService],
  // Exporta ServersService para que pueda ser usado en ChannelsModule
  exports: [ServersService],
})
export class ServersModule {}
