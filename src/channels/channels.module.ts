import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { Channel } from './entities/channel.entity';
import { DiscordServer } from '../discord-servers/entities/discord-server.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Channel, DiscordServer])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
