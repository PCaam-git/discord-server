import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    // guarda el momento en que se recibe la solicitud
    const startTime = Date.now();

    // escucha el evento 'finish' para saber cuándo se ha completado la respuesta
    response.on('finish', () => {
      const duration = Date.now() - startTime;
      const method = request.method;
      const url = request.originalUrl;
      const statusCode = response.statusCode;

      // muestra en consola el metodo, la url, el código de estado y el tiempo que tardó en procesar la solicitud
      console.log(`[${method}] ${url} - ${statusCode} - ${duration}ms`);
    });

    next();
  }
}
