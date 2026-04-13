import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscordServerDto } from './create-discord-server.dto';

export class UpdateDiscordServerDto extends PartialType(CreateDiscordServerDto) {}
