import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DiscordServer } from './discord-server.entity';

@Entity('server_members')
export class ServerMember {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Aquí se guardara 'OWNER', 'ADMIN' o 'MEMBER'
  @Column({ default: 'MEMBER' }) 
  role!: string;

  // El apodo específico que el usuario se pone solo en este servidor
  @Column({ nullable: true })
  nickname?: string; 

  @CreateDateColumn()
  joinedAt!: Date;

  // Relación N:1 hacia el Usuario
  @ManyToOne(() => User, (user) => user.serverMembers)
  user!: User;

  // Relación N:1 hacia el Servidor
  @ManyToOne(() => DiscordServer, (server) => server.members)
  server!: DiscordServer;
}