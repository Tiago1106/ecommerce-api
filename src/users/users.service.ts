import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException(`Email ${data.email} já está em uso`);
    }

    return this.prisma.user.create({ data });
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
