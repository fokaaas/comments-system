import { Injectable } from '@nestjs/common';
import { UserRepo } from '../../database/repos/user.repo';
import { RegistrationDto } from '../dto/registration.dto';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { MailService } from './mail.service';
import { TokenType } from '@prisma/client';
import { AlreadyRegisteredException } from '../../exceptions/already-registered.exception';

@Injectable()
export class AuthService {
  constructor (
    private userRepo: UserRepo,
    private mailService: MailService,
  ) {}

  private avatars = [
    'https://i.imgur.com/rguER1N.jpeg',
    'https://i.imgur.com/GC26038.jpeg',
    'https://i.imgur.com/j9uCXbt.jpeg',
  ];

  async register (data: RegistrationDto) {
    await this.checkUniqueData(data.username, data.email);

    const password = await this.hashPassword(data.password);
    const index = Math.floor(Math.random() * this.avatars.length + 1);
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
      message: 'Щоб пдітвердити пошту, перейдіть за посиланням нижче. Посилання діє 1 годину.',
      link: `https://comments.com/verifyEmail/${token}`,
    });
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
