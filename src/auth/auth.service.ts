import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';

type AuthResponse = {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Registra al usuario y devuelve directamente un token para poder autenticarse.
  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    // se comprueba si el email ya existe
    const existingUser = await this.usersService.findByEmail(
      registerUserDto.email,
    );

    // email duplicado: 409 Conflict
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // la contraseña se cifra con bcrypt
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    const user = await this.usersService.create({
      username: registerUserDto.username,
      email: registerUserDto.email,
      password: hashedPassword,
    });

    return this.buildAuthResponse(user);
  }
// Comprueba las credenciales y genera el token de acceso.
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);

    // no se indica si el fallo proviene del email o de la contraseña para no dar pistas a posibles atacantes.
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // compara la contraseña proporcionada con el hash almacenado en la BD
    const validPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.buildAuthResponse(user);
  }

  // Construye la respuesta de autenticación con el token JWT y los datos del usuario (sin contraseña).
  private buildAuthResponse(user: User): AuthResponse {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      // la respuesta excluye la contraseña
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
