import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // O controlador deve estar associado a '/auth'
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin') // A rota signin é definida aqui
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }
}
