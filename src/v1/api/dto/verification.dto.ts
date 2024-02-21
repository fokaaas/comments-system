import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerificationDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Email is not correct' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;
}