import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Discord Server API')
    .setDescription(
      'API REST para gestionar usuarios, servidores, canales y mensajes como en Discord',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Las rutas se establecerán a partir de /api
  console.log('Discord Server API running on http://localhost:${port}/api');
  console.log(`Swagger docs available on http://localhost:${port}/api/docs`);
}

boostrap();
