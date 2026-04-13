import { Test, TestingModule } from '@nestjs/testing';
import { DiscordServersController } from './discord-servers.controller';
import { DiscordServersService } from './discord-servers.service';

describe('DiscordServersController', () => {
  let controller: DiscordServersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscordServersController],
      providers: [DiscordServersService],
    }).compile();

    controller = module.get<DiscordServersController>(DiscordServersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
