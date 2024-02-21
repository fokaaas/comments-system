export class PaginatedDataDto<T=object> {
  data: T[];
  pagination: {
    amount: number;
    totalAmount: number;
    totalPages: number;
    pageSize: number;
    page: number;
    prevPageElems: number;
    nextPageElems: number;
  };
}