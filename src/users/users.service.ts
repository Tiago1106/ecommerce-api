import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(data: Omit<User, 'id'>): Promise<User> {
    const { email, password } = data;

    const existing = this.users.find((u) => u.email === email);
    if (existing) {
      throw new ConflictException(`Email ${email} já está em uso`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: uuidv4(), // UUID gerado aqui
      ...data,
      password: hashedPassword,
    };

    this.users.push(newUser);
    return newUser;
  }

  findOneById(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }
}
