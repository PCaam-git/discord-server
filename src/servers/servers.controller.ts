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
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  // Listar todos los servidores. También filtra por nombre
  @Get()
  findAll(@Query('name') name?: string) {
    return this.serversService.findAll(name);
  }

  // Búsqueda por nombre o descripción
  @Get('search')
  search(@Query('q') q: string) {
    return this.serversService.search(q ?? '');
  }

  // Buscar un servidor por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serversService.findOne(+id);
  }

  // Crear un nuevo servidor
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateServerDto) {
    return this.serversService.create(body);
  }

  // Editar solo nombre o descripción
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateServerDto) {
    return this.serversService.update(+id, body);
  }

  // Eliminar un servidor.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.serversService.remove(+id);
  }
}
