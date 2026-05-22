import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export type JwtPayload = {
  // idenficiador del usuario autenticado.
  sub: number;
  username: string;
  email: string;
  // fechas de emisión y expiración que añade JWT al firmar el token.
  iat?: number;
  exp?: number;
};

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // NestJS ejecuta este método antes de entrar en una ruta protegida.
  canActivate(context: ExecutionContext): boolean {
    // Obtiene la petición HTTP original sobre la que se aplicó el Guard.
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    // Extrae el token enviado en el header Authorization.
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      // Verifica firma y caducidad del JWT.
      const payload = this.jwtService.verify<JwtPayload>(token);
      // Guarda la identidad validada para que el controlador pueda usar request.user.sub.
      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  // solo permite tokens enviados como "Bearer <token>" en el header Authorization.
  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
