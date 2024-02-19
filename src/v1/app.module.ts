import { Module } from '@nestjs/common';
import { AuthModule } from './api/modules/auth.module';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
