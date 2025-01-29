import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('password123', 10), // Contraseña encriptada
    },
  ];

  findByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
