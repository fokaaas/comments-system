import { Module } from '@nestjs/common';
import { UserRepo } from './repos/user.repo';
import { PrismaService } from './prisma.service';

@Module({
  providers: [UserRepo, PrismaService],
  exports: [UserRepo],
})
export class DatabaseModule {}