import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentRepo {
  constructor (
    private prisma: PrismaService,
  ) {}

  private include = {
    files: true,
    user: true,
  };

  async create (data: Prisma.CommentUncheckedCreateInput) {
    return this.prisma.comment.create({
      data,
      include: this.include,
    });
  }

  async updateById (id: string, data: Prisma.CommentUncheckedUpdateInput) {
    return this.prisma.comment.update({
      where: { id },
      data,
      include: this.include,
    });
  }

  async findMany (args: Prisma.CommentFindManyArgs) {
    return this.prisma.comment.findMany({
      include: this.include,
      ...args,
    });
  }

  async count (data: Prisma.CommentCountArgs) {
    return this.prisma.comment.count(data);
  }

  async findById (id: string) {
    return this.prisma.comment.findFirst({
      where: { id },
      include: this.include,
    });
  }
}
