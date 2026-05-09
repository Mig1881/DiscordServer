import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: createUserDto.password, 
      birthDate: createUserDto.birthDate,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['serverMembers', 'serverMembers.server'], 
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['serverMembers', 'serverMembers.server'],
    });
    
    if (!user) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    //Extrigo 'password' por un lado, y el resto de campos por otro
    //Esto lo hago porque en la base de datos se llama de otra manera, ya que lo encriptare mas adelante
    const { password, ...restoDeCampos } = updateUserDto;
    Object.assign(user, restoDeCampos);
    if (password) {
      user.passwordHash = password;
    }
    
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}