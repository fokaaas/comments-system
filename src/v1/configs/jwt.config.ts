import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
  constructor (
    private configService: ConfigService,
  ) {}

  get secret (): string {
    return this.configService.get<string>('security.secret');
  }

  get accessTtl (): string {
    return this.configService.get<string>('jwt.accessTtl');
  }

  get refreshTtl (): string {
    return this.configService.get<string>('jwt.refreshTtl');
  }
}