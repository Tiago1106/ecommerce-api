import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Importe o UsersModule
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule, // Importe o UsersModule
    JwtModule.register({
      secret: 'seuSegredo', // Altere para um segredo real
      signOptions: { expiresIn: '60s' }, // Expiração do token (exemplo)
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController], // Certifique-se de que o AuthController está sendo importado aqui
})
export class AuthModule {}
