import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  // TypeOrmModule.forFeature es el equivalente a decirle a Spring "Aquí tienes el @Repository de esta Entidad"
  imports: [TypeOrmModule.forFeature([User])], 
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}