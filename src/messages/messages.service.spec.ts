import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Channel } from '../channels/entities/channel.entity';
import { NotFoundException } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';

const mockMessageRepo: any = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };
const mockChannelRepo: any = { findOne: jest.fn() };
const mockUserRepo: any = { findOne: jest.fn() };

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getRepositoryToken(Message), useValue: mockMessageRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Channel), useValue: mockChannelRepo },
        { provide: MessagesGateway, useValue: { broadcastNewMessage: jest.fn() } },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('debería lanzar NotFoundException si se intenta enviar mensaje a un canal fantasma', async () => {
    mockChannelRepo.findOne.mockResolvedValue(null);
    const createDto = { content: 'Hola', channelId: 'canal-falso' };
    await expect(service.create(createDto as any, 'user-1')).rejects.toThrow(NotFoundException);
  });

  it('debería guardar el mensaje correctamente si el canal existe', async () => {
    const createDto = { content: 'Hola Mundo', channelId: 'canal-real' };
    const mockChannel = { id: 'canal-real', name: 'General' };
    const mockUser = { id: 'user-1', username: 'Juan' };
    
    mockChannelRepo.findOne.mockResolvedValue(mockChannel);
    mockUserRepo.findOne.mockResolvedValue(mockUser);
    
    const nuevoMensaje = { id: 'msg-1', content: 'Hola Mundo', author: mockUser, channel: mockChannel };
    mockMessageRepo.create.mockReturnValue(nuevoMensaje);
    mockMessageRepo.save.mockResolvedValue(nuevoMensaje);
    // ✨ AÑADIDO: Simulamos la respuesta del findOne interno de tu código
    mockMessageRepo.findOne.mockResolvedValue(nuevoMensaje);

    const result = await service.create(createDto as any, 'user-1');
    expect(result.content).toEqual('Hola Mundo');
    expect(mockMessageRepo.save).toHaveBeenCalled();
  });
});