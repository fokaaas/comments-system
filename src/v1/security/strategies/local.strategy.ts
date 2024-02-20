import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { State, User } from '@prisma/client';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor (
    private prisma: PrismaService,
  ) {
    super();
  }

  async validate (username: string, password: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
          { username },
        ],
      },
    });
    if (!user) throw new EntityNotFoundException('User');

    if (user.state !== State.APPROVED) {
      throw new ForbiddenException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password is wrong');

    delete user.password;
    return user;
  }
}
