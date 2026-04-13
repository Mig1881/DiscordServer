import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DiscordServersModule } from './discord-servers/discord-servers.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE');

        //Configuración para DESARROLLO (SQLite)
        if (dbType === 'sqlite') {
          console.log('📦 Conectando a SQLite para Desarrollo...');
          return {
            type: 'sqlite',
            database: configService.get<string>('DB_DATABASE') || 'dev.sqlite',
            autoLoadEntities: true,
            synchronize: true, // TypeORM crea las tablas por nosotros
            logging: ['query', 'error'],
          };
        }

        //Configuración para PRODUCCIÓN (PostgreSQL)
        console.log('🐘 Conectando a PostgreSQL para Producción...');
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true, 
        };
      },
    }),
    
    UsersModule,
    
    DiscordServersModule,
    
    ChannelsModule,
    
    MessagesModule,
    
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
