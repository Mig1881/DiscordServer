import { IsString, IsOptional, MinLength, IsIn, IsUUID } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @MinLength(2, { message: 'El nombre del canal debe tener al menos 2 letras' })
  name!: string;

  @IsString()
  @IsIn(['TEXT', 'VOICE'], { message: 'El tipo de canal solo puede ser TEXT o VOICE' })
  type!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID('all', { message: 'El serverId debe ser un UUID válido' })
  serverId!: string;
}
