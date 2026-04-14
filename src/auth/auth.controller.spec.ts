import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService: any = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debería devolver un token al hacer login con éxito', async () => {
    const loginDto = { email: 'test@test.com', password: '123' };
    mockAuthService.login.mockResolvedValue({ access_token: 'token_seguro_jwt' });
    
    const result = await controller.login(loginDto);
    expect(result.access_token).toBeDefined();
    expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
  });
});