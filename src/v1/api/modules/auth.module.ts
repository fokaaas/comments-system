import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { DatabaseModule } from '../../database/database.module';
import { MailModule } from './mail.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [DatabaseModule, MailModule],
})
export class AuthModule {}
