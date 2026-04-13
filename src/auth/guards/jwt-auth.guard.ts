import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('¡Alto ahí! No tienes token de acceso (Pasaporte)');
    }
    
    try {
      // Se Verifica el token con la misma clave secreta matemática
      const payload = await this.jwtService.verifyAsync(token, {
      });
      
      request['user'] = payload;
      
    } catch {
      throw new UnauthorizedException('Tu token es inválido o ha caducado');
    }
    // ¡El token es válido, déjalo pasar!
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
