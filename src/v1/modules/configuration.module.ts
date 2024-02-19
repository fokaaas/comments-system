import { Module } from '@nestjs/common';
import { SmtpConfig } from '../configs/smtp.config';
import { ConfigModule } from '@nestjs/config';
import { JwtConfig } from '../configs/jwt.config';

@Module({
  providers: [SmtpConfig, JwtConfig],
  exports: [SmtpConfig, JwtConfig],
})
export class ConfigurationModule extends ConfigModule {}