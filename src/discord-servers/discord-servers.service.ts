import { Injectable, InternalServerErrorException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
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
    
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
  ) {}

  // Recibe el ownerId por separado (extraído del Token)
  async create(createDiscordServerDto: CreateDiscordServerDto, ownerId: string): Promise<DiscordServer> {
    try {
      // Creo el Servidor
      const newServer = this.serverRepository.create({
        name: createDiscordServerDto.name,
        description: createDiscordServerDto.description,
        lang: createDiscordServerDto.lang,
        iconUrl: createDiscordServerDto.iconUrl,
      });

      // Se guarda en BD para que TypeORM le genere un ID
      const savedServer = await this.serverRepository.save(newServer);

      // Se Crea al Dueño en la tabla intermedia
      const ownerMember = this.serverMemberRepository.create({
        role: 'OWNER',
        // Uso el ID del token, no del DTO
        user: { id: ownerId }, 
        server: { id: savedServer.id },
      });

      // Se guarda la relación
      await this.serverMemberRepository.save(ownerMember);

      return await this.findOne(savedServer.id);

    } catch (error) {
      throw new InternalServerErrorException('Error al crear el servidor.');
    }
  }

  async findAll(): Promise<DiscordServer[]> {
    return await this.serverRepository.find({
      // todas las filas de discord-server y todas las filas en las que aparezcan en server-member con su user asiciado
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

  // Actualizar servidor
  async update(id: string, updateDiscordServerDto: UpdateDiscordServerDto, userId: string): Promise<DiscordServer> {
    //¿Es miembro y es OWNER o ADMIN?
    const member = await this.serverMemberRepository.findOne({
      where: { server: { id }, user: { id: userId } },
    });

    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('No tienes permisos para editar este servidor. Se requiere rol OWNER o ADMIN.');
    }

    const server = await this.findOne(id);
    
    Object.assign(server, updateDiscordServerDto);
    
    return await this.serverRepository.save(server);
  }

  // Eliminar servidor
  async remove(id: string, userId: string): Promise<void> {
    //Validar permisos: ¿Es el dueño absoluto?
    const member = await this.serverMemberRepository.findOne({
      where: { server: { id }, user: { id: userId } },
    });

    if (!member || member.role !== 'OWNER') {
      throw new ForbiddenException('Solo el dueño del servidor puede eliminarlo.');
    }

    const server = await this.findOne(id);
    
    await this.serverRepository.remove(server);
  }
  // Metodo para unirse a un servidor
  async joinServer(serverId: string, userId: string): Promise<DiscordServer> {
    const server = await this.findOne(serverId);

    const existingMember = await this.serverMemberRepository.findOne({
      where: {
        server: { id: server.id },
        user: { id: userId },
      },
    });

    if (existingMember) {
      throw new ConflictException('Ya eres miembro de este servidor');
    }

    const newMember = this.serverMemberRepository.create({
      role: 'MEMBER',
      user: { id: userId },
      server: { id: server.id },
    });

    await this.serverMemberRepository.save(newMember);

    return await this.findOne(server.id);
  }
}