import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentRepo {
  constructor (
    private prisma: PrismaService,
  ) {}

  async create (data: Prisma.CommentUncheckedCreateInput) {
    return this.prisma.comment.create({
      data,
    });
  }

  async updateById (id: string, data: Prisma.CommentUncheckedUpdateInput) {
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async findMany (args: Prisma.CommentFindManyArgs) {
    return this.prisma.comment.findMany({
      ...args,
    });
  }

  async count (data: Prisma.CommentCountArgs) {
    return this.prisma.comment.count(data);
  }
}
