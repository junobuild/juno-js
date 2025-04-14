import * as z from 'zod';
import {
  type Description,
  type Key,
  type RawUserId,
  type Timestamp,
  DescriptionSchema,
  KeySchema,
  RawUserIdSchema,
  TimestampSchema
} from './satellite';

/**
 * @see TimestampMatcher
 */
export const TimestampMatcherSchema = z.union([
  z.object({Equal: TimestampSchema}),
  z.object({GreaterThan: TimestampSchema}),
  z.object({LessThan: TimestampSchema}),
  z.object({Between: z.tuple([TimestampSchema, TimestampSchema])})
]);

/**
 * TimestampMatcher matches a timestamp field using a specific strategy.
 */
export type TimestampMatcher =
  | {Equal: Timestamp}
  | {GreaterThan: Timestamp}
  | {LessThan: Timestamp}
  | {Between: [Timestamp, Timestamp]};

/**
 * @see ListMatcher
 */
export const ListMatcherSchema = z
  .object({
    key: KeySchema.optional(),
    description: DescriptionSchema.optional(),
    created_at: TimestampMatcherSchema.optional(),
    updated_at: TimestampMatcherSchema.optional()
  })
  .strict();

/**
 * Matcher used to filter list results.
 */
export interface ListMatcher {
  key?: Key;
  description?: Description;
  created_at?: TimestampMatcher;
  updated_at?: TimestampMatcher;
}

/**
 * @see ListPaginate
 */
export const ListPaginateSchema = z
  .object({
    start_after: KeySchema.optional(),
    limit: z.bigint().optional()
  })
  .strict();

/**
 * Optional pagination controls for listing.
 */
export interface ListPaginate {
  start_after?: Key;
  limit?: bigint;
}

/**
 * @see ListOrderField
 */
export const ListOrderFieldSchema = z.enum(['Keys', 'CreatedAt', 'UpdatedAt']);

/**
 * Enum representing possible fields to order by.
 */
export type ListOrderField = 'Keys' | 'CreatedAt' | 'UpdatedAt';

/**
 * @see ListOrder
 */
export const ListOrderSchema = z
  .object({
    desc: z.boolean(),
    field: ListOrderFieldSchema
  })
  .strict();

/**
 * Ordering strategy for listing documents.
 */
export interface ListOrder {
  desc: boolean;
  field: ListOrderField;
}

/**
 * @see ListParams
 */
export const ListParamsSchema = z
  .object({
    matcher: ListMatcherSchema.optional(),
    paginate: ListPaginateSchema.optional(),
    order: ListOrderSchema.optional(),
    owner: RawUserIdSchema.optional()
  })
  .strict();

/**
 * Full set of listing parameters.
 */
export interface ListParams {
  matcher?: ListMatcher;
  paginate?: ListPaginate;
  order?: ListOrder;
  owner?: RawUserId;
}

/**
 * Represents a list result.
 *
 * @template T - The type of the data returned per item.
 * @see JsListResults
 */
export const createListResultsSchema = <T extends z.ZodTypeAny>(itemData: T) =>
  z
    .object({
      items: z.array(z.tuple([KeySchema, itemData])),
      items_length: z.bigint(),
      items_page: z.bigint().optional(),
      matches_length: z.bigint(),
      matches_pages: z.bigint().optional()
    })
    .strict();

/**
 * List results, parameterized by type of returned item.
 */
export interface ListResults<T> {
  items: [Key, T][];
  items_length: bigint;
  items_page?: bigint;
  matches_length: bigint;
  matches_pages?: bigint;
}
