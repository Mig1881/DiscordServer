import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ServerMember } from '../../discord-servers/entities/server-member.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('users')
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'date', nullable: true })
  birthDate!: Date;

  @CreateDateColumn()
  joinedDiscordAt!: Date;

  @Column({ default: true })
  darkMode!: boolean;

  @Column({ default: 'en' })
  uiLang!: string; 
  
  // Un usuario tiene MUCHAS membresías en diferentes servidores
  @OneToMany(() => ServerMember, (serverMember) => serverMember.user)
  serverMembers!: ServerMember[];

  //relación 1:N -> Un usuario escribe MUCHOS mensajes
  @OneToMany(() => Message, (message) => message.author)
  messages!: Message[];
}