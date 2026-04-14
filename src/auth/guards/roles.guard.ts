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
    const channelId = request.params.id; // ID del canal que intentan borrar

    if (!channelId) return false;

    //Se busca el canal para saber a qué servidor pertenece
    const channel = await this.channelRepository.findOne({ 
      where: { id: channelId },
      relations: ['server'] 
    });

    if (!channel) throw new NotFoundException('El canal no existe');

    //Se busca el rol del usuario en ESE servidor específico
    const member = await this.serverMemberRepository.findOne({
      where: {
        user: { id: userId },
        server: { id: channel.server.id }
      }
    });

    if (!member) throw new ForbiddenException('No eres miembro de este servidor');

    //¿El rol del usuario está entre los permitidos?
    const hasRole = requiredRoles.includes(member.role);
    
    if (!hasRole) {
      throw new ForbiddenException('Solo el Propietario (Owner) puede realizar esta acción');
    }

    return true;
  }
}