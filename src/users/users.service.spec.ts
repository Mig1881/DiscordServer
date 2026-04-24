import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

//Creo el "Mock"
const mockUserRepository: any = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        //Le decimos a NestJS: "Cuando el servicio te pida el Repositorio de User, dale este falso"
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // Test 1: Comprueba que el servicio se instancia correctamente sin explotar
  it('deberia de estar definido, se instancia correctamente', () => {
    expect(service).toBeDefined();
  });

  // Test 2: lógica de NotFoundException
  it('deberia de lanzar el error correcto, NotFoundException', async () => {
    // Añadimos "as any" dentro de los paréntesis
    mockUserRepository.findOne.mockResolvedValue(null);

    // Verificamos que si buscamos un ID falso, nuestro código lanza el error correcto
    await expect(service.findOne('id-falso-123')).rejects.toThrow(NotFoundException);
  });
});