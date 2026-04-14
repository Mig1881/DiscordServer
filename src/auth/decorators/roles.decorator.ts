import { SetMetadata } from '@nestjs/common';

//Se define la clave que se usara para guardar los roles en los metadatos
export const ROLES_KEY = 'roles';
// El decorador recibirá una lista de roles permitidos
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);