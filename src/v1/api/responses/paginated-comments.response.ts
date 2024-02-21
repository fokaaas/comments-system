import { ApiProperty } from '@nestjs/swagger';
import { CommentResponse } from './comment.response';
import { PaginationResponse } from './pagination.response';

export class PaginatedCommentsResponse {
  @ApiProperty({
    type: [CommentResponse],
  })
    data: CommentResponse[];

  @ApiProperty({
    type: PaginationResponse,
  })
    pagination: PaginationResponse;
}