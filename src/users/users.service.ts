import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
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
    return await this.userRepository.find();
  }

  findOne(id: number) { return `This action returns a #${id} user`; }
  update(id: number, updateUserDto: any) { return `This action updates a #${id} user`; }
  remove(id: number) { return `This action removes a #${id} user`; }
}
