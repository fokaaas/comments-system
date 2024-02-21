import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';
import { UserResponse } from './user.response';

class FileResponse {
  @ApiProperty()
    link: string;

  @ApiProperty({
    enum: FileType,
  })
    type: FileType;
}

export class CommentResponse {
  @ApiProperty()
    id: string;

  @ApiProperty({
    type: UserResponse,
  })
    user: UserResponse;

  @ApiProperty()
    userId: string;

  @ApiProperty()
    parentId: string;

  @ApiProperty()
    responses: [];

  @ApiProperty()
    text: string;

  @ApiProperty()
    createdAt: string;

  @ApiProperty({
    type: [FileResponse],
  })
    files: FileResponse[];
}