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
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServersService } from './servers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateServerDto, @Req() request: AuthenticatedRequest) {
    return this.serversService.create(body, request.user.sub);
  }

  // Editar solo nombre o descripción
  @Patch(':id')
  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  update(@Param('id') id: string, @Body() body: UpdateServerDto) {
    return this.serversService.update(+id, body);
  }

  // Eliminar un servidor.
  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protege la ruta con JWT
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.serversService.remove(+id);
  }
}
