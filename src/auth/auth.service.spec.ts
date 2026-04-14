import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

const mockUsersService: any = { create: jest.fn() };
const mockJwtService: any = { signAsync: jest.fn() };
const mockUserRepository: any = { findOne: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository }, 
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debería lanzar UnauthorizedException si el usuario no existe al hacer login', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    await expect(service.login('falso@correo.com', '123')).rejects.toThrow(UnauthorizedException);
  });


  it('debería devolver un access_token y los datos del usuario si el login es correcto', async () => {
    const passwordPura = 'passwordCorrecta';
    const hashReal = await bcrypt.hash(passwordPura, 10);
    
    const mockUser = { id: '1', username: 'GamerPro', email: 'test@test.com', passwordHash: hashReal };
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    mockJwtService.signAsync.mockResolvedValue('jwt_token_falso');

    const result = await service.login(mockUser.email, passwordPura);
    
    expect(mockJwtService.signAsync).toHaveBeenCalled();
    expect(result).toEqual({ 
      access_token: 'jwt_token_falso',
      user: {
        id: '1',
        username: 'GamerPro'
      }
    });
  });
});