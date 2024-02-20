import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import fromExtractors = ExtractJwt.fromExtractors;
import * as process from 'process';
import { JwtPayloadDto } from '../../api/dto/jwt-payload.dto';
import { PrismaService } from '../../database/prisma.service';
import { EntityNotFoundException } from '../../exceptions/entity-not-found.exception';
import { State } from '@prisma/client';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor (
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: fromExtractors([cookieExtractor]),
      secretOrKey: process.env.SECRET,
    });
  }

  async validate (payload: JwtPayloadDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });

    if (!user) throw new EntityNotFoundException('User');

    if (user.state !== State.APPROVED) {
      throw new ForbiddenException();
    }

    delete user.password;
    return user;
  }
}

function cookieExtractor (req: Request): string | null {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refresh'];
  }
  return token;
}