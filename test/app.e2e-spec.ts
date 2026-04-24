/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';

describe('Discord Backend Integration (e2e)', () => {
  let app: INestApplication;

  //Se usa beforeAll para levantar la app una sola vez antes de los tests
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init(); // Arranca NestJS y se conecta a SQLite usando .env
  });

  //Se cierra la app al terminar
  afterAll(async () => {
    await app.close();
  });

  it('🚀 La aplicación debe inicializar todos los módulos y conectar a la BD correctamente', () => {
    expect(app).toBeDefined();
  });
});