import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const mockChannelsService: any = {
  findAll: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};

describe('ChannelsController', () => {
  let controller: ChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelsController],
      providers: [{ provide: ChannelsService, useValue: mockChannelsService }],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true }) // Bypass JWT
      .overrideGuard(RolesGuard).useValue({ canActivate: () => true }) // Bypass Roles
      .compile();

    controller = module.get<ChannelsController>(ChannelsController);
  });

  it('debería crear un canal correctamente con su DTO', async () => {
    const newChannelDto = { name: 'Juegos', serverId: 'server-1' };
    mockChannelsService.create.mockResolvedValue({ id: '2', ...newChannelDto });
    
    const result = await controller.create(newChannelDto as any);
    expect(result).toHaveProperty('id', '2');
    expect(mockChannelsService.create).toHaveBeenCalledWith(newChannelDto);
  });

  it('debería permitir borrar un canal (Simulando ser OWNER por el Guard)', async () => {
    mockChannelsService.remove.mockResolvedValue(undefined);
    await controller.remove('canal-1');
    expect(mockChannelsService.remove).toHaveBeenCalledWith('canal-1');
  });
}); 