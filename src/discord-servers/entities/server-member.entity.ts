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
  //La regla de oro para las tablas pivote: No pueden existir si falta una de sus dos mitades
  //Comportamiento: Si el USUARIO se borra, su membresía en el servidor se destruye.
  @ManyToOne(() => User, (user) => user.serverMembers, { onDelete: 'CASCADE' })
  user!: User;

  //Comportamiento: Si el SERVIDOR se borra, todas las membresías vinculadas a él se destruyen.
  @ManyToOne(() => DiscordServer, (server) => server.members, { onDelete: 'CASCADE' })
  server!: DiscordServer;
}