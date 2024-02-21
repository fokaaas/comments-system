import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
    id: string;

  @ApiProperty()
    username: string;

  @ApiProperty()
    email: string;

  @ApiProperty()
    avatar: string;

  @ApiProperty()
    state: string;

  @ApiProperty()
    homepage: string;

  @ApiProperty()
    lastPasswordUpdated: Date;

  @ApiProperty()
    createdAt: Date;
}