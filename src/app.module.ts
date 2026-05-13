import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { ServersModule } from './servers/servers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // NestJS lee las variables desde el archvo .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Conexión con la base de datos PostgreSQL usando TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      // Auto carga de entidades y sincronización de la base de datos
      autoLoadEntities: true,
      // Se usa solo en desarrollo para crear automáticamente las tablas al modificar entidades. En producción, usar migraciones.
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ServersModule,
    ChannelsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
