import { Body, Controller, Post } from '@nestjs/common';
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
}
