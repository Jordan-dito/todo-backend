import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, User } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    // Busca el usuario por su nombre de usuario
    const user = this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Valida la contraseña
    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Retorna el usuario si las credenciales son válidas
    return user;
  }

  login(user: User): { access_token: string } {
    // Genera el payload para el token JWT
    const payload: { username: string; sub: number } = {
      username: user.username,
      sub: user.id,
    };
    // Retorna el token JWT
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
