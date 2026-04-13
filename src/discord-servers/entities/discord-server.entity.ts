import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Channel } from '../../channels/entities/channel.entity';
import { ServerMember } from './server-member.entity'; 

@Entity('discord_servers')
export class DiscordServer {
  
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'es' })
  lang!: string;

  @Column({ nullable: true })
  iconUrl?: string; 

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ServerMember, (serverMember) => serverMember.server)
  members!: ServerMember[];
  //Un servidor tiene MUCHOS canales
  @OneToMany(() => Channel, (channel) => channel.server)
  channels!: Channel[];
}