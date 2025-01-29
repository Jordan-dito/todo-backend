import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { cookies: { jwt?: string } }>();
    const cookies = request.cookies as { jwt?: string };

    if (!cookies || !cookies.jwt) {
      throw new UnauthorizedException('Token no encontrado en cookies');
    }

    // Si la cookie 'jwt' está presente, permite el acceso
    return true;
  }
}
