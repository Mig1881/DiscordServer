import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Channel } from '../channels/entities/channel.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    //Se Verifica que el usuario existe
    const author = await this.userRepository.findOne({ where: { id: createMessageDto.authorId } });
    if (!author) {
      throw new NotFoundException(`El usuario con ID ${createMessageDto.authorId} no existe`);
    }

    //Se Verifica que el canal existe
    const channel = await this.channelRepository.findOne({ where: { id: createMessageDto.channelId } });
    if (!channel) {
      throw new NotFoundException(`El canal con ID ${createMessageDto.channelId} no existe`);
    }

    //Se Crea el mensaje en memoria
    const newMessage = this.messageRepository.create({
      content: createMessageDto.content,
      isSpoiler: createMessageDto.isSpoiler,
      type: createMessageDto.type,
      author: { id: author.id },
      channel: { id: channel.id },
    });

    //Se guarda en la base de datos
    await this.messageRepository.save(newMessage);

    return await this.messageRepository.findOne({
      where: { id: newMessage.id },
      relations: ['author', 'channel'], // Cargamos las relaciones para ver quién lo escribió
    }) as Message;
  }

  // Todos los mensajes
  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find({
      relations: ['author', 'channel'],
      order: { createdAt: 'ASC' }
    });
  }

  //Buscar un mensaje concreto
  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['author', 'channel'],
    });

    if (!message) {
      throw new NotFoundException(`El mensaje con ID ${id} no existe`);
    }
    return message;
  }

  //Editar un mensaje (al ser un clon de discord solo dejo modificar content e isSpoiler)
  async update(id: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id);

    Object.assign(message, updateMessageDto);

    await this.messageRepository.save(message);

    return await this.findOne(id);
  }

  //Borrar un mensaje
  async remove(id: string): Promise<void> {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);
  }
}