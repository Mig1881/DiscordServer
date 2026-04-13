import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

//Creo el Mock de la capa de Servicio
const mockUsersService: any = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  // Test 1: Comprueba que el controlador se instancia sin explotar
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test 2: Comprueba que el método findAll del controlador devuelve lo que dicta el servicio
  it('should return an array of users', async () => {
    // Preparacion de datos falsos
    const expectedUsers = [{ id: '123', username: 'TestUser' }];
    
    // Le digo al servicio falso que devuelva esos datos
    mockUsersService.findAll.mockResolvedValue(expectedUsers);

    // Llamo al controlador y esperamos que nos devuelva exactamente eso
    expect(await controller.findAll()).toBe(expectedUsers);
  });
});
