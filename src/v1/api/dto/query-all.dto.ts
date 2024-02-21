import { IsIn, IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryAllDTO {
  @ApiPropertyOptional({
    description: 'Number of the page',
  })
  @IsNumberString({}, {
    message: 'Page must be a number',
  })
  @IsOptional()
    page?: number;

  @ApiPropertyOptional({
    description: 'Amount of the elements in the page',
  })
  @IsNumberString({}, {
    message: 'PageSize must be a number',
  })
  @IsOptional()
    pageSize?: number;

  @ApiPropertyOptional({
    enum: ['username', 'email'],
  })
  @IsOptional()
    sort?: 'username' | 'email';

  @ApiPropertyOptional({
    description: 'Sorting order',
    enum: ['asc', 'desc'],
  })
  @IsIn(['asc', 'desc'], { message: 'Wrong value for order' })
  @IsOptional()
    order?: 'asc' | 'desc';
}

export class SortDTO {
  sort?: string;
  order?: 'asc' | 'desc';
}


export class PageDTO {
  page?: number;
  pageSize?: number;
}

export class Page {
  take: number;
  skip: number;
}

export class Sort {
  orderBy: {
    [k: string]: 'asc' | 'desc';
  };
}