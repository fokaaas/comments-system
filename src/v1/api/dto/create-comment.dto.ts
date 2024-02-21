import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiPropertyOptional()
  @IsOptional()
    parentId?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Text cannot be empty' })
    text: string;
}
