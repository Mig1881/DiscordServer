import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  // Solo se permite editar el contenido y si es spoiler
  
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El mensaje editado no puede estar vacío' })
  content?: string;

  @IsOptional()
  @IsBoolean()
  isSpoiler?: boolean;
}
