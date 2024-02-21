import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './configs/config';
import { CommentModule } from './modules/comment.module';

@Module({
  imports: [
    AuthModule,
    CommentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
})
export class AppModule {}
