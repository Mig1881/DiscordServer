import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockUsersService: any = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true }) // Bypass
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('debería devolver una lista de usuarios', async () => {
    const expectedUsers = [{ id: '1', username: 'Alfa' }, { id: '2', username: 'Beta' }];
    mockUsersService.findAll.mockResolvedValue(expectedUsers);
    expect(await controller.findAll()).toBe(expectedUsers);
  });

  it('debería devolver un usuario concreto por su ID', async () => {
    const user = { id: '99', username: 'Zeta' };
    mockUsersService.findOne.mockResolvedValue(user);
    expect(await controller.findOne('99')).toEqual(user);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('99');
  });

  it('debería llamar al servicio para borrar un usuario', async () => {
    mockUsersService.remove.mockResolvedValue({ affected: 1 });
    await controller.remove('99');
    expect(mockUsersService.remove).toHaveBeenCalledWith('99');
  });
});