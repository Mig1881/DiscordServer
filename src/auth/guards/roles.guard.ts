import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ServerMember } from '../../discord-servers/entities/server-member.entity';
import { Channel } from '../../channels/entities/channel.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. ¿Qué roles requiere esta ruta?
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene el decorador @Roles, se permite el paso
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub; // ID del usuario desde el JWT
    
    let serverIdToValidate: string;

    //Esto lo he añadido para simular la logica de discord
    //Añado una restriccion mas que no esta en las especificaciones iniciales
    //SOlo un OWNER puede crear un canal en el servidor
    //Asi como, lo que pide el profesor, solo un Owner puede borrar un canal
    // intentan CREAR un canal, el serverId viene en el body
    if (request.body && request.body.serverId) {
      serverIdToValidate = request.body.serverId;
    } 
    // --- LÓGICA PARA DELETE/PATCH: Si no está en el body, se busca por la URL
    else {
      const channelId = request.params.id; // ID del canal
      if (!channelId) return false;

      // Se busca el canal para saber a qué servidor pertenece
      const channel = await this.channelRepository.findOne({ 
        where: { id: channelId },
        relations: ['server'] 
      });

      if (!channel) throw new NotFoundException('El canal no existe');
      
      serverIdToValidate = channel.server.id;
    }

    // Se busca el rol del usuario en ESE servidor específico
    const member = await this.serverMemberRepository.findOne({
      where: {
        user: { id: userId },
        server: { id: serverIdToValidate }
      }
    });

    if (!member) throw new ForbiddenException('No eres miembro de este servidor');

    // ¿El rol del usuario está entre los permitidos?
    const hasRole = requiredRoles.includes(member.role);
    
    if (!hasRole) {
      throw new ForbiddenException('Solo el Propietario (Owner) puede realizar esta acción');
    }

    return true;
  }
}