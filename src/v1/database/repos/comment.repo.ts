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

  async find (args: Prisma.CommentFindManyArgs) {
    return this.prisma.comment.findMany({
      ...args,
      include: this.include,
    });
  }
}