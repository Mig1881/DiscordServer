import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscordServersService } from './discord-servers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiscordServer } from './entities/discord-server.entity';
import { ServerMember } from './entities/server-member.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

//Se crean los "dobles" para las dos tablas que usa el servicio
const mockServerRepository: any = {
  findOne: jest.fn(),
};

const mockMemberRepository: any = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('DiscordServersService - Lógica Crítica', () => {
  let service: DiscordServersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordServersService,
        // Mock de la tabla DiscordServer
        {
          provide: getRepositoryToken(DiscordServer),
          useValue: mockServerRepository,
        },
        // Mock de la tabla ServerMember
        {
          provide: getRepositoryToken(ServerMember),
          useValue: mockMemberRepository,
        },
      ],
    }).compile();

    service = module.get<DiscordServersService>(DiscordServersService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('Método joinServer (Lógica de Negocio)', () => {
    const mockUserId = 'user-123';
    const mockServerId = 'server-456';

    it('Debería lanzar NotFoundException si el servidor no existe', async () => {
      //Se configura el mock para que simule que no encontró el servidor
      mockServerRepository.findOne.mockResolvedValue(null);

      //Se verifica que explota con el error correcto
      await expect(service.joinServer(mockServerId, mockUserId))
        .rejects.toThrow(NotFoundException);
    });

    it('Debería lanzar ConflictException si el usuario ya es miembro', async () => {
      //Se simula que el servidor SÍ existe
      mockServerRepository.findOne.mockResolvedValue({ id: mockServerId, name: 'Test Server' });
      
      //Se simula que ya encontró un registro en la tabla intermedia (ya es miembro)
      mockMemberRepository.findOne.mockResolvedValue({ id: 'member-789', role: 'MEMBER' });

      //Se verifica que lanza el Conflicto (409)
      await expect(service.joinServer(mockServerId, mockUserId))
        .rejects.toThrow(ConflictException);
    });

    it('Debería unir al usuario al servidor con éxito si no era miembro', async () => {
      //El servidor existe
      const fakeServer = { id: mockServerId, name: 'Test Server' };
      mockServerRepository.findOne.mockResolvedValue(fakeServer);
      
      //El usuario NO está en la tabla intermedia (findOne devuelve null)
      mockMemberRepository.findOne.mockResolvedValue(null);
      
      //Se simula  la creación y guardado exitoso
      const fakeNewMember = { id: 'new-member', role: 'MEMBER' };
      mockMemberRepository.create.mockReturnValue(fakeNewMember);
      mockMemberRepository.save.mockResolvedValue(fakeNewMember);

      //Se ejecuta el método
      const result = await service.joinServer(mockServerId, mockUserId);

      //Se comprueba que devuelve el mensaje de éxito correcto
      expect(result).toEqual(fakeServer);
      //Se comprueba que llamó a "save" en la base de datos
      expect(mockMemberRepository.save).toHaveBeenCalledWith(fakeNewMember);
    });
  });
});