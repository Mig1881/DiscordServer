import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordServersService } from './discord-servers.service';
import { DiscordServersController } from './discord-servers.controller';
import { DiscordServer } from './entities/discord-server.entity';
import { ServerMember } from './entities/server-member.entity';

@Module({
  //Le doy acceso a las dos tablas, para que el servicio pueda grabar datos
  imports: [TypeOrmModule.forFeature([DiscordServer, ServerMember])],
  controllers: [DiscordServersController],
  providers: [DiscordServersService],
})
export class DiscordServersModule {}
