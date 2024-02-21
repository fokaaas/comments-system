import { Module } from '@nestjs/common';
import { CommentService } from '../api/services/comment.service';
import { CommentController } from '../api/controllers/comment.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtStrategy } from '../security/strategies/jwt.strategy';
import { FileModule } from './file.module';

@Module({
  providers: [CommentService, JwtStrategy],
  controllers: [CommentController],
  imports: [DatabaseModule, FileModule],
})
export class CommentModule {}
