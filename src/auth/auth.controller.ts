import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'miguel@zaragoza.es' },
        password: { type: 'string', example: 'miguelPassword123' },
      },
    },
  })
  @HttpCode(HttpStatus.OK) // El login suele devuelve un 200 OK, no un 201 Created
  @Post('login')
  login(@Body() loginDto: Record<string, any>) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
