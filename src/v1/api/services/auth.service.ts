import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepo } from '../../database/repos/user.repo';
import { RegistrationDto } from '../dto/registration.dto';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { MailService } from './mail.service';
import { TokenType, State, User } from '@prisma/client';
import { AlreadyRegisteredException } from '../../exceptions/already-registered.exception';
import { PrismaService } from '../../database/prisma.service';
import { TokenExpiredException } from '../../exceptions/token-expired.exception';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from '../../configs/jwt.config';

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;

@Injectable()
export class AuthService {
  constructor (
    private userRepo: UserRepo,
    private mailService: MailService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private jwtConfig: JwtConfig,
  ) {}

  private avatars = [
    'https://i.imgur.com/rguER1N.jpeg',
    'https://i.imgur.com/GC26038.jpeg',
    'https://i.imgur.com/j9uCXbt.jpeg',
  ];

  async register (data: RegistrationDto) {
    await this.checkUniqueData(data.username, data.email);

    const password = await this.hashPassword(data.password);
    const index = Math.floor(Math.random() * this.avatars.length);
    const token = v4();

    await this.userRepo.create({
      ...data,
      avatar: this.avatars[index],
      password,
      tokens: {
        create: {
          value: token,
          type: TokenType.EMAIL,
        },
      },
    });

    await this.mailService.send({
      to: data.email,
      subject: 'Верифікація пошти на comments.com',
      message: 'Щоб підтвердити пошту, перейдіть за посиланням нижче. Посилання діє 1 годину.',
      link: `https://comments.com/verifyEmail/${token}`,
    });
  }

  async verify (token: string): Promise<{ accessToken: string, refreshToken: string }> {
    const dbToken = await this.prisma.token.findFirst({
      where: { value: token },
    });

    if (!dbToken) throw new NotFoundException();

    if (Date.now() - dbToken.createdAt.getTime() > HOUR) {
      throw new TokenExpiredException();
    }

    const user = await this.userRepo.updateById(dbToken.userId, {
      state: State.APPROVED,
      tokens: {
        deleteMany: {
          type: TokenType.EMAIL,
        },
      },
    });

    return this.getTokens(user);
  }

  private getTokens (user: User): { accessToken: string, refreshToken: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      createdAt: Date.now(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.jwtConfig.refreshTtl,
      }),
    };
  }

  private async checkUniqueData (username: string, email: string) {
    const user = await this.userRepo.find({
      OR: [
        { username },
        { email },
      ],
    });

    if (user) throw new AlreadyRegisteredException();
  }

  private async hashPassword (password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }
}
