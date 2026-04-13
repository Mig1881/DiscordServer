import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Channel } from '../../channels/entities/channel.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  //tipo 'text' porque los mensajes pueden ser largos
  @Column('text')
  content!: string;

  //Para la etiqueta de Spoiler
  @Column({ default: false })
  isSpoiler!: boolean;

  //Para diferenciar mensajes normales de los del sistema o respuestas
  @Column({ default: 'DEFAULT' })
  type!: string;

  // El momento exacto en el que se envió
  @CreateDateColumn()
  createdAt!: Date;

  // El momento exacto en el que se editó por última vez
  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Channel, (channel) => channel.messages, { onDelete: 'CASCADE' })
  channel!: Channel;

  @ManyToOne(() => User, (user) => user.messages, { onDelete: 'CASCADE' })
  author!: User;
}
