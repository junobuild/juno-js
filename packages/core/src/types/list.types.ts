import type {Principal} from '@dfinity/principal';

export interface ListResults<T> {
  // The data - e.g. the documents or assets depending which list was called
  items: T[];
  // The numbers of items - basically items.length
  items_length: bigint;
  // If query is paginated, at what page (starting from 0) the items find place
  items_page?: bigint;
  // The total numbers of matching results
  matches_length: bigint;
  // If query is paginated, the total number (starting from 0) of pages
  matches_pages?: bigint;
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

export interface ListMatcher {
  key?: string;
  description?: string;
}

export interface ListParams {
  matcher?: ListMatcher;
  paginate?: ListPaginate;
  order?: ListOrder;
  owner?: ListOwner;
}
