import { Module } from '@nestjs/common';
import { AuthService } from '../api/services/auth.service';
import { AuthController } from '../api/controllers/auth.controller';
import { DatabaseModule } from '../database/database.module';
import { MailModule } from './mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from './configuration.module';
import { LocalStrategy } from '../security/strategies/local.strategy';
import { RefreshStrategy } from '../security/strategies/refresh.strategy';

@Module({
  providers: [AuthService, LocalStrategy, RefreshStrategy],
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    MailModule,
    ConfigurationModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: process.env.ACCESS_TTL,
      },
    }),
  ],
})
export class AuthModule {}
