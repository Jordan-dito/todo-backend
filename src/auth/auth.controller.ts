import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    try {
      const user = await this.authService.validateUser(username, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const accessToken = this.authService.login(user);
      return {
        access_token: accessToken.access_token,
        message: 'Logged in successfully',
      };
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
