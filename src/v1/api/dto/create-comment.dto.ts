import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
    parentId?: string;

  @IsNotEmpty({ message: 'Text cannot be empty' })
    text: string;
}
