import { Body, Controller, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegistrationDto } from '../dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor (
    private authService: AuthService,
  ) {}

  @Post('/register')
  async register (
    @Body() body: RegistrationDto,
  ) {
    return this.authService.register(body);
  }

  @Patch('/verify/:token')
  async verify (
    @Param('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, ...accessToken } = await this.authService.verify(token);
    response.cookie('refresh', refreshToken);
    return accessToken;
  }
}
