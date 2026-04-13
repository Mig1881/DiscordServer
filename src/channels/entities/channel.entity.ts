import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { DiscordServer } from '../../discord-servers/entities/discord-server.entity';

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

  //Relación N:1 -> Muchos canales pertenecen a UN servidor
  @ManyToOne(() => DiscordServer, (server) => server.channels, {
    onDelete: 'CASCADE',
    // Si se borra el servidor, se borran sus canales
  })
  server!: DiscordServer;
}
