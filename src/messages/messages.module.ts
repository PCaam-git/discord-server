import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsModule } from '../channels/channels.module';
import { UsersModule } from '../users/users.module';
import { Message } from './message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ChannelsModule, UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
