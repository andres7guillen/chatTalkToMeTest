export interface ApiResponse<T> {
    success: boolean;
    errorCode: number;
    message: string;
    data: T;
  }