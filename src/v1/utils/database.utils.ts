import { Page, PageDTO } from '../api/dto/query-all.dto';
import { PaginatedDataDto } from '../api/dto/paginated-data.dto';

export class DatabaseUtils {
  protected static getPage ({ page = 0, pageSize }: PageDTO): Page | object {
    page = +page;
    pageSize = +pageSize;
    if (!pageSize) return {};
    if (page === 0) {
      return {
        skip: 0,
        take: pageSize * 2,
      };
    }
    return {
      skip: (page - 1) * pageSize,
      take: pageSize * 3,
    };
  }

  static async paginate<T=any> (
    repository,
    { page = 0, pageSize }: PageDTO,
    args: any
  ): Promise<PaginatedDataDto<T>> {
    page = +page;
    pageSize = +pageSize;

    const result = await repository.findMany({
      ...args,
      ...this.getPage({ page, pageSize }),
    });
    const totalAmount = await repository.count({
      where: args.where,
    });

    const totalPages = Math.ceil(totalAmount/pageSize);
    const pages = Math.ceil(result.length / pageSize);

    if (!pageSize) {
      return {
        data: result,
        pagination: {
          amount: result.length,
          totalAmount,
          totalPages,
          pageSize,
          page,
          prevPageElems: 0,
          nextPageElems: 0,
        },
      };
    }
    if (page === 0) {
      const data = result.slice(0, pageSize);
      return {
        data,
        pagination: {
          amount: data.length,
          totalAmount,
          totalPages,
          pageSize,
          page,
          prevPageElems: 0,
          nextPageElems: data.slice(pageSize).length,
        },
      };
    } else if (pages === 2) {
      const data = result.slice(pageSize);
      return {
        data,
        pagination: {
          amount: data.length,
          totalAmount,
          totalPages,
          pageSize,
          page,
          prevPageElems: data.slice(0, pageSize).length,
          nextPageElems: 0,
        },
      };
    }
    const data = result.slice(pageSize, pageSize*2);
    return {
      data,
      pagination: {
        amount: data.length,
        totalAmount,
        totalPages,
        pageSize,
        page,
        prevPageElems: data.slice(0, pageSize).length,
        nextPageElems: data.slice(pageSize*2).length,
      },
    };
  }
}