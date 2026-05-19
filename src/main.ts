import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function boostrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      // Solo permite las propiedades definidas en los DTOs
      whitelist: true,
      // Rechaza las solicitudes que contienen propiedades no definidas
      forbidNonWhitelisted: true,
      // transforma los datos recibidos en los datos esperados.
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Las rutas se establecerán a partir de /api
  console.log('Discord Server API running on http://localhost:${port}/api');
}

boostrap();
