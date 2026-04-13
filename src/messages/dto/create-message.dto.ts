import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsIn, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  content!: string;

  @IsOptional()
  @IsBoolean()
  isSpoiler?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['DEFAULT', 'SYSTEM', 'REPLY'], { message: 'Tipo de mensaje no válido' })
  type?: string;

  /* @IsUUID('all', { message: 'El authorId debe ser un UUID válido' })
  authorId!: string; */
  //El autor lo voy a sacar del token a partir de ahora

  @IsUUID('all', { message: 'El channelId debe ser un UUID válido' })
  channelId!: string;
}
