import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockMessagesService: any = { create: jest.fn(), findAll: jest.fn() };

describe('MessagesController', () => {
  let controller: MessagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [{ provide: MessagesService, useValue: mockMessagesService }],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it('debería extraer el usuario del request para crear un mensaje', async () => {
    const req = { user: { sub: 'user-123' } };
    const createDto = { content: 'Hola', channelId: 'chan-1' };
    mockMessagesService.create.mockResolvedValue({ id: 'msg-1', ...createDto });
    
    await controller.create(createDto as any, req as any);
    expect(mockMessagesService.create).toHaveBeenCalledWith(createDto, 'user-123');
  });
});