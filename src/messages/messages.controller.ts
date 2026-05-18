import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('channels/:channelId/messages')
  findAllByChannel(@Param('channelId') channelId: string) {
    return this.messagesService.findAllByChannel(+channelId);
  }

  @Post('channels/:channelId/messages')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('channelId') channelId: string,
    @Body() body: CreateMessageDto,
  ) {
    return this.messagesService.create(+channelId, body);
  }

  @Get('messages/search')
  search(@Query('query') query: string) {
    return this.messagesService.search(query ?? '');
  }

  @Get('messages/:id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch('messages/:id')
  update(@Param('id') id: string, @Body() body: UpdateMessageDto) {
    return this.messagesService.update(+id, body);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
