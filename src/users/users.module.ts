import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service'; // Certifique-se de que o PrismaService está disponível

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService], // Exporte o UsersService para que outros módulos possam utilizá-lo
})
export class UsersModule {}
