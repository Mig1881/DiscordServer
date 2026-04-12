import { IsString, IsEmail, MinLength, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  username!: string;

  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida' })
  birthDate?: Date;

  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;

  @IsOptional()
  @IsString()
  uiLang?: string;
}
