export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
