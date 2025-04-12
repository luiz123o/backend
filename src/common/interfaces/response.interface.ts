export interface IResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    [key: string]: any;
  };
}

export interface IPaginatedResponse<T> extends IResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 