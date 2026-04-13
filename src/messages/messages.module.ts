import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Channel } from '../channels/entities/channel.entity';

@Module({
  //Le doy acceso a las 3 tablas
  imports: [TypeOrmModule.forFeature([Message, User, Channel])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
