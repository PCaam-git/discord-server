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
import { ChannelsService } from './channels.service';

type CreateChannelBody = {
  name: string;
  type?: string;
};

type UpdateChannelBody = Partial<CreateChannelBody>;

// No se especifica ruta base para poder usar /:serverId/channels y /channels/:id
@Controller()
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  // Obtener todos los canales de un servidor específico
  @Get('servers/:serverId/channels')
  findAllByServer(@Param('serverId') serverId: string) {
    return this.channelsService.findAllByServer(+serverId);
  }

  // Crea un nuevo canal dentro de un servidor específico
  @Post('servers/:serverId/channels')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('serverId') serverId: string, @Body() body: CreateChannelBody) {
    return this.channelsService.create(+serverId, body);
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

  // Actualiza un canal por su ID
  @Patch('channels/:id')
  update(@Param('id') id: string, @Body() body: UpdateChannelBody) {
    return this.channelsService.update(+id, body);
  }

  // Elimina un canal por su ID
  @Delete('channels/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.channelsService.remove(+id);
  }
}
