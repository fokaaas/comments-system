import { IsEmail, IsNotEmpty, IsOptional, IsUrl, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty()
  @Matches(new RegExp(/^[a-zA-Z0-9_]{2,20}$/), {
    message: 'Username is not correct (a-zA-Z0-9_), or too short (min: 2), or too long (max: 40)',
  })
  @IsNotEmpty({ message: 'Username cannot be empty' })
    username: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Email is not correct' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;

  @ApiProperty()
  @Matches(new RegExp(/^(?=.*[A-Za-z])(?=.*\d).{6,32}$/), {
    message: 'Password must be between 6 and 32 characters long, include at least 1 digit and 1 latin letter',
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string;

  @ApiPropertyOptional()
  @IsUrl({}, { message: 'Homepage must be URL' })
  @IsOptional()
    homepage?: string;
}