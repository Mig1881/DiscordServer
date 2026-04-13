import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //REGISTRO
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encripto la contraseña (10 saltos de seguridad)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return { message: 'Usuario registrado con éxito. Ya puedes hacer login.' };
  }

  // ✨ LOGIN: Verificamos credenciales y devolvemos el Token
  async login(email: string, pass: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    
    // Si no existe el usuario o la contraseña no hace match con el hash de la base de datos
    if (!user || !(await bcrypt.compare(pass, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Se crea  el "Payload"
    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, username: user.username }
    };
  }
}
