import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from './channels.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { DiscordServer } from '../discord-servers/entities/discord-server.entity';
import { ServerMember } from '../discord-servers/entities/server-member.entity';
import { NotFoundException } from '@nestjs/common';

const mockChannelRepository: any = {
  findOne: jest.fn(),
  delete: jest.fn(),
};

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        { provide: getRepositoryToken(Channel), useValue: mockChannelRepository },
        { provide: getRepositoryToken(DiscordServer), useValue: {} },
        { provide: getRepositoryToken(ServerMember), useValue: {} },
      ],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  it('debería lanzar NotFoundException al intentar borrar un canal que no existe', async () => {
    mockChannelRepository.findOne.mockResolvedValue(null);
    await expect(service.remove('id-falso')).rejects.toThrow(NotFoundException);
  });
});
