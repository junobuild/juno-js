export interface ApiOkResponse<T> {
  ok: {
    data: T;
  };
}

export interface ApiErrResponse {
  err: {
    code: number;
    message: string;
  };
}

export type ApiResponse<T> = ApiOkResponse<T> | ApiErrResponse;
