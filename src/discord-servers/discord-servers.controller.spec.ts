import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscordServersController } from './discord-servers.controller';
import { DiscordServersService } from './discord-servers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockServersService: any = { joinServer: jest.fn() };

describe('DiscordServersController', () => {
  let controller: DiscordServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscordServersController],
      providers: [{ provide: DiscordServersService, useValue: mockServersService }],
    })
      .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DiscordServersController>(DiscordServersController);
  });

  it('debería delegar la unión al servidor correctamente', async () => {
    const req = { user: { sub: 'user-123' } };
    mockServersService.joinServer.mockResolvedValue({ message: 'Exito' });
    
    const result = await controller.joinServer('server-1', req as any);
    expect(mockServersService.joinServer).toHaveBeenCalledWith('server-1', 'user-123');
  });
});
