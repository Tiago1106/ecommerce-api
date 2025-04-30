import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      role?: UserRole; // opcional, default será 'client'
    },
  ) {
    return this.authService.signUp(body);
  }
}
