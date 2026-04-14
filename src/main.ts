import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // ✨ 2. Configuramos el título y descripción de tu API
  const config = new DocumentBuilder()
    .setTitle('Discord Clone API')
    .setDescription('Documentación interactiva de la API para el clon de Discord')
    .setVersion('1.0')
    .addBearerAuth() // ✨ Súper importante: Esto añade el botón para meter el JWT
    .build();

  // ✨ 3. Generamos el documento y creamos la ruta web
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
