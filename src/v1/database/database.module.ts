import { Module } from '@nestjs/common';
import { UserRepo } from './repos/user.repo';
import { PrismaService } from './prisma.service';
import { CommentRepo } from './repos/comment.repo';

@Module({
  providers: [UserRepo, PrismaService, CommentRepo],
  exports: [UserRepo, PrismaService, CommentRepo],
})
export class DatabaseModule {}