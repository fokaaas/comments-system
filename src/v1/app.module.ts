import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './configs/config';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
})
export class AppModule {}
