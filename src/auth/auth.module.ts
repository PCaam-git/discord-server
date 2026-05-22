import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // el secreto se recupera de las variables de entorno
        const jwtSecret = configService.get<string>('JWT_SECRET');

        // si falta el secreto, se impide arrancar
        if (!jwtSecret) {
          throw new Error('JWT_SECRET no está definido en .env');
        }

        return {
          secret: jwtSecret,
          signOptions: {
            // tiempo de validez del access token emitido al usuario
            expiresIn: '1h',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
