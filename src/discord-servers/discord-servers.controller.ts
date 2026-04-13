import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DiscordServersService } from './discord-servers.service';
import { CreateDiscordServerDto } from './dto/create-discord-server.dto';
import { UpdateDiscordServerDto } from './dto/update-discord-server.dto';

@Controller('discord-servers')
export class DiscordServersController {
  constructor(private readonly discordServersService: DiscordServersService) {}

  @Post()
  create(@Body() createDiscordServerDto: CreateDiscordServerDto) {
    return this.discordServersService.create(createDiscordServerDto);
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
  update(@Param('id') id: string, @Body() updateDiscordServerDto: UpdateDiscordServerDto) {
    return this.discordServersService.update(id, updateDiscordServerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.discordServersService.remove(id);
  }
}