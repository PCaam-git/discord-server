import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function boostrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Las rutas se establecerán a partir de /api
  console.log('Discord Server API running on http://localhost:${port}/api');
}

boostrap();
