import { IsString, IsOptional, MinLength, IsUUID, IsUrl } from 'class-validator';

export class CreateDiscordServerDto {
  @IsString()
  @MinLength(3, { message: 'El nombre del servidor debe tener al menos 3 letras' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Si envías un icono, debe ser una URL válida' })
  iconUrl?: string;

}
