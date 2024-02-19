import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepo {
  constructor (
    private prisma: PrismaService,
  ) {}

  async create (data: Prisma.UserUncheckedCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async find (where: Prisma.UserWhereInput) {
    return this.prisma.user.findFirst({
      where,
    });
  }

  async updateById (id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}