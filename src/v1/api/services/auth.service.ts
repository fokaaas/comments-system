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
import { TooManyActionsException } from '../../exceptions/too-many-actions.exceptions';
import { ConfigService } from '@nestjs/config';

const SESSIONS = 5;

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
    private configService: ConfigService,
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

    await this.sendVerificationEmail(data.email, token);
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
    
    const tokens = this.getTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async requestVerification (email: string) {
    const user = await this.userRepo.find({ email });
    if (!user) throw new NotFoundException();

    if (user.state !== State.PENDING) {
      throw new AlreadyRegisteredException();
    }

    await this.checkVerificationRequests(email);

    const token = v4();

    await this.userRepo.updateById(user.id, {
      tokens: {
        create: {
          value: token,
          type: TokenType.EMAIL,
        },
      },
    });
    await this.sendVerificationEmail(user.email, token);
  }

  private async checkVerificationRequests (email: string) {
    const dbToken = await this.prisma.token.findFirst({
      where: {
        type: TokenType.EMAIL,
        user: {
          email,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (dbToken && (Date.now() - dbToken.createdAt.getTime() < MINUTE)) {
      throw new TooManyActionsException();
    }
  }

  private async sendVerificationEmail (to: string, token: string) {
    const frontBaseUrl = this.configService.get<string>('frontBaseUrl');
    await this.mailService.send({
      to,
      subject: 'Верифікація пошти на comments.com',
      message: 'Щоб підтвердити пошту, перейдіть за посиланням нижче. Посилання діє 1 годину.',
      link: `${frontBaseUrl}/verifyEmail/${token}`,
    });
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
  
  private async saveRefreshToken (userId: string, token: string) {
    await this.userRepo.updateById(userId, {
      tokens: {
        create: {
          type: TokenType.REFRESH,
          value: token,
        },
      },
    });
  }

  private async hashPassword (password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async checkSessions (userId: string) {
    const tokens = await this.prisma.token.findMany({
      where: {
        userId,
        type: TokenType.REFRESH,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (tokens.length >= SESSIONS) {
      const { value } = tokens[0];
      await this.prisma.token.delete({
        where: { value },
      });
    }
  }

  async loginOrRefresh (user: User) {
    await this.checkSessions(user.id);
    const tokens = this.getTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
