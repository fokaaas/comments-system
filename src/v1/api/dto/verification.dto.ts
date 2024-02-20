import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerificationDto {
  @IsEmail({}, { message: 'Email is not correct' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;
}