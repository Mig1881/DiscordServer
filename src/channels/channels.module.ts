import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { Channel } from './entities/channel.entity';
import { DiscordServer } from '../discord-servers/entities/discord-server.entity';
import { ServerMember } from '../discord-servers/entities/server-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, DiscordServer, ServerMember])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}