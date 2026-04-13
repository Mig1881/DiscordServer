import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscordServerDto } from './dto/create-discord-server.dto';
import { UpdateDiscordServerDto } from './dto/update-discord-server.dto';
import { DiscordServer } from './entities/discord-server.entity';
import { ServerMember } from './entities/server-member.entity';

@Injectable()
export class DiscordServersService {
  constructor(
    @InjectRepository(DiscordServer)
    private serverRepository: Repository<DiscordServer>,
    
    // ✨ Inyectamos el repositorio de la tabla intermedia
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
  ) {}

  async create(createDiscordServerDto: CreateDiscordServerDto): Promise<DiscordServer> {
    try {
      //Creo el Servidor
      const newServer = this.serverRepository.create({
        name: createDiscordServerDto.name,
        description: createDiscordServerDto.description,
        lang: createDiscordServerDto.lang,
        iconUrl: createDiscordServerDto.iconUrl,
      });

      // se guarda en BD para que TypeORM le genere un ID
      const savedServer = await this.serverRepository.save(newServer);

      //Se Crea al Dueño en la tabla intermedia
      const ownerMember = this.serverMemberRepository.create({
        role: 'OWNER',
        user: { id: createDiscordServerDto.ownerId }, 
        server: { id: savedServer.id },
      });

      // se guarda la relación
      await this.serverMemberRepository.save(ownerMember);

      return savedServer;

    } catch (error) {
      throw new InternalServerErrorException('Error al crear el servidor. Verifica que el ownerId exista.');
    }
  }

  async findAll(): Promise<DiscordServer[]> {
    return await this.serverRepository.find({
      // todas las filas de discord-server y todas las filas en las que aparezcan en server-member con su user asiciado
      //esto es impresionante esta funcion, es un JOIN LEFT en toda regla, lo empaqueta solo en un JSON
      relations: ['members', 'members.user'], 
    });
  }
  // Buscar uno solo por ID
  async findOne(id: string): Promise<DiscordServer> {
    const server = await this.serverRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
       // Quiero ver quién está dentro
    });

    if (!server) {
      throw new NotFoundException(`El servidor con ID ${id} no existe`);
    }
    return server;
  }

  //Actualizar servidor
  async update(id: string, updateDiscordServerDto: UpdateDiscordServerDto): Promise<DiscordServer> {
    const server = await this.findOne(id);
    
    Object.assign(server, updateDiscordServerDto);
    
    return await this.serverRepository.save(server);
  }

  //Eliminar servidor
  async remove(id: string): Promise<void> {
    const server = await this.findOne(id);
    
    //Se tienen que borrar todas las relaciones en la tabla intermedia asociadas a este servidor
    await this.serverMemberRepository.delete({ server: { id: server.id } });
    
    //Una ve z borradas se puede borrar el servidor con seguridad
    await this.serverRepository.remove(server);
  }
}