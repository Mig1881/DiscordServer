import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { DiscordServer } from '../../discord-servers/entities/discord-server.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: 'TEXT' })
  type!: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relación N:1 -> Muchos canales pertenecen a UN servidor
  @ManyToOne(() => DiscordServer, (server) => server.channels, {
    onDelete: 'CASCADE',
  })
  server!: DiscordServer;
  
  //relación 1:N hacia los mensajes
  @OneToMany(() => Message, (message) => message.channel)
  messages!: Message[];
}