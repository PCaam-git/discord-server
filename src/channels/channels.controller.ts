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
  UseGuards,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelsService } from './channels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// No se especifica ruta base para poder usar /:serverId/channels y /channels/:id
@Controller()
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  // Obtener todos los canales de un servidor específico
  @Get('servers/:serverId/channels')
  findAllByServer(@Param('serverId') serverId: string) {
    return this.channelsService.findAllByServer(+serverId);
  }

  // Búsqueda de canales por nombre o tipo
  @Get('channels/search')
  search(@Query('q') q: string) {
    return this.channelsService.search(q ?? '');
  }

  // Obtener un canal por su ID
  @Get('channels/:id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(+id);
  }

  // Crea un nuevo canal dentro de un servidor específico
  @Post('servers/:serverId/channels')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con JWT
  @HttpCode(HttpStatus.CREATED)
  create(@Param('serverId') serverId: string, @Body() body: CreateChannelDto) {
    return this.channelsService.create(+serverId, body);
  }

  // Actualiza un canal por su ID
  @Patch('channels/:id')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con JWT
  update(@Param('id') id: string, @Body() body: UpdateChannelDto) {
    return this.channelsService.update(+id, body);
  }

  // Elimina un canal por su ID
  @Delete('channels/:id')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con JWT
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.channelsService.remove(+id);
  }
}
