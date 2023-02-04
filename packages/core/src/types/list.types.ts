export interface ListResults<T> {
  items: T[];
  length: bigint;
  matches_length: bigint;
}

export interface PaginateDocs {
  startAfter?: string;
  limit?: number;
}

export interface OrderDocs {
  desc: boolean;
}

export interface ListParams {
  matcher?: string;
  paginate?: PaginateDocs;
  order?: OrderDocs;
}
