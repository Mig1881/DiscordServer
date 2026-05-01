import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express'; // ✨ Usamos 'import type' para evitar el error de TypeScript
import { DiscordServersService } from './discord-servers.service';
import { CreateDiscordServerDto } from './dto/create-discord-server.dto';
import { UpdateDiscordServerDto } from './dto/update-discord-server.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('discord-servers')
export class DiscordServersController {
  constructor(private readonly discordServersService: DiscordServersService) {}

  @Post()
  create(@Body() createDiscordServerDto: CreateDiscordServerDto, @Req() request: Request) {
    const userId = request['user'].sub;
    
    return this.discordServersService.create(createDiscordServerDto, userId);
  }

  //Endpoint para unirse: POST /discord-servers/ID_DEL_SERVIDOR/join
  @Post(':id/join')
  joinServer(@Param('id') serverId: string, @Req() request: Request) {
    const userId = request['user'].sub;
    return this.discordServersService.joinServer(serverId, userId);
  }

  @Get()
  findAll() {
    return this.discordServersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) { // Cambiado a string
    return this.discordServersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscordServerDto: UpdateDiscordServerDto, @Req() request: Request){
    const userId = request['user'].sub; // Extrigo el ID
    return this.discordServersService.update(id, updateDiscordServerDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() request: Request) {
    const userId = request['user'].sub; // Extrigo el ID del usuario del JWT
    return this.discordServersService.remove(id, userId); // Se le pasa al servicio
  }
}