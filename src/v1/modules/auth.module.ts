import { Module } from '@nestjs/common';
import { AuthService } from '../api/services/auth.service';
import { AuthController } from '../api/controllers/auth.controller';
import { DatabaseModule } from '../database/database.module';
import { MailModule } from './mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from './configuration.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    DatabaseModule,
    MailModule,
    // ConfigurationModule,
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
