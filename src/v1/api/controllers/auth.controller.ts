import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegistrationDto } from '../dto/registration.dto';
import { VerificationDto } from '../dto/verification.dto';

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

  @Post('/register/verify/:token')
  async verify (
    @Param('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, ...accessToken } = await this.authService.verify(token);
    response.cookie('refresh', refreshToken);
    return accessToken;
  }

  @Post('/register/verify')
  async requestVerification (
    @Body() { email }: VerificationDto,
  ) {
    return this.authService.requestVerification(email);
  }

}
