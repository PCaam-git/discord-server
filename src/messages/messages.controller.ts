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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';

@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('channels/:channelId/messages')
  findAllByChannel(@Param('channelId') channelId: string) {
    return this.messagesService.findAllByChannel(+channelId);
  }

  @Get('messages/search')
  search(@Query('query') query: string) {
    return this.messagesService.search(query ?? '');
  }

  @Get('messages/:id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Post('channels/:channelId/messages')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con JWT
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('channelId') channelId: string,
    @Body() body: CreateMessageDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.messagesService.create(+channelId, body, request.user.sub);
  }

  @Patch('messages/:id')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con JWT
  update(@Param('id') id: string, @Body() body: UpdateMessageDto) {
    return this.messagesService.update(+id, body);
  }

  @Delete('messages/:id')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con JWT
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
