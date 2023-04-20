import type {Principal} from '@dfinity/principal';

export interface ListResults<T> {
  items: T[];
  length: bigint;
  matches_length: bigint;
}

export interface ListPaginate {
  startAfter?: string;
  limit?: number;
}

export type ListOrderField = 'keys' | 'updated_at' | 'created_at';

export interface ListOrder {
  desc: boolean;
  field: ListOrderField;
}

export type ListOwner = string | Principal;

export interface ListParams {
  matcher?: string;
  paginate?: ListPaginate;
  order?: ListOrder;
  owner?: ListOwner;
}
