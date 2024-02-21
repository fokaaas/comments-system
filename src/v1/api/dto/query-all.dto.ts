import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class QueryAllDTO {
  @IsNumberString({}, {
    message: 'Page must be a number',
  })
  @IsOptional()
    page?: number;

  @IsNumberString({}, {
    message: 'PageSize must be a number',
  })
  @IsOptional()
    pageSize?: number;

  @IsOptional()
    sort?: string;

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