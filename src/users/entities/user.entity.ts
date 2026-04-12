import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
}