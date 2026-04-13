import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';
import { DiscordServer } from '../discord-servers/entities/discord-server.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    
    @InjectRepository(DiscordServer)
    private serverRepository: Repository<DiscordServer>,
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    //Comprobacion de que el servidor existe
    const server = await this.serverRepository.findOne({ 
      where: { id: createChannelDto.serverId } 
    });

    if (!server) {
      throw new NotFoundException(`El servidor con ID ${createChannelDto.serverId} no existe`);
    }

    //Se Crea el canal y lo vinculamos
    const newChannel = this.channelRepository.create({
      name: createChannelDto.name,
      type: createChannelDto.type,
      description: createChannelDto.description,
      server: { id: server.id },
    });

    return await this.channelRepository.save(newChannel);
  }

  //Buscar todos los canales (y ver a qué servidor pertenecen)
  async findAll(): Promise<Channel[]> {
    return await this.channelRepository.find({
      relations: ['server'], 
    });
  }

  //Buscar un canal por ID con manejo de error 404
  async findOne(id: string): Promise<Channel> {
    const channel = await this.channelRepository.findOne({
      where: { id },
      relations: ['server'],
    });

    if (!channel) {
      throw new NotFoundException(`El canal con ID ${id} no existe`);
    }
    return channel;
  }

  //Actualizar un canal
  async update(id: string, updateChannelDto: UpdateChannelDto): Promise<Channel> {
    const channel = await this.findOne(id); 

    Object.assign(channel, updateChannelDto);

    await this.channelRepository.save(channel);

    return await this.findOne(id); 
  }

  //Eliminar un canal
  async remove(id: string): Promise<void> {
    const channel = await this.findOne(id); // Verificamos que existe
    await this.channelRepository.remove(channel);
  }
}
