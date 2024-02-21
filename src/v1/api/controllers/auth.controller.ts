import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegistrationDto } from '../dto/registration.dto';
import { VerificationDto } from '../dto/verification.dto';
import { LocalAuthGuard } from '../../security/guards/local-auth.guard';
import { RefreshAuthGuard } from '../../security/guards/refresh-auth.guard';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenResponse } from '../responses/access-token.response';
import { LoginDto } from '../dto/login.dto';
import { UserResponse } from '../responses/user.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register new user' })
  async register (@Body() body: RegistrationDto) {
    return this.authService.register(body);
  }

  @Post('/register/verify/:token')
  @ApiResponse({ type: AccessTokenResponse })
  @ApiOperation({ summary: 'Verify token from email' })
  async verify (
    @Param('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, ...accessToken } =
      await this.authService.verify(token);
    response.cookie('refresh', refreshToken);
    return accessToken;
  }

  @Post('/register/verify')
  @ApiOperation({ summary: 'Request one more verification' })
  async requestVerification (@Body() { email }: VerificationDto) {
    return this.authService.requestVerification(email);
  }

  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: AccessTokenResponse })
  @ApiOperation({ summary: 'Login existing user' })
  async login (@Req() req, @Res({ passthrough: true }) response: Response) {
    const { refreshToken, ...accessToken } =
      await this.authService.loginOrRefresh(req.user);
    response.cookie('refresh', refreshToken);
    return accessToken;
  }

  @ApiCookieAuth()
  @UseGuards(RefreshAuthGuard)
  @Post('/refresh')
  @ApiResponse({ type: AccessTokenResponse })
  @ApiOperation({ summary: 'Refresh access token by cookie' })
  async refresh (@Req() req, @Res({ passthrough: true }) response: Response) {
    const { refreshToken, ...accessToken } =
      await this.authService.loginOrRefresh(req.user);
    response.cookie('refresh', refreshToken);
    return accessToken;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  @ApiResponse({ type: UserResponse })
  @ApiOperation({ summary: 'Get information about current user' })
  async getMe (@Req() req) {
    return req.user;
  }
}
