import type {Principal} from '@icp-sdk/core/principal';
import {j} from '@junobuild/schema';
import * as z from 'zod';

export const NotifyTopUpArgsSchema = j.strictObject({
  block_index: j.bigint(),
  canister_id: j.principal()
});

export const NotifyErrorSchema = z.union([
  z.strictObject({
    Refunded: z.strictObject({
      block_index: z.bigint().optional(),
      reason: z.string()
    })
  }),
  z.strictObject({InvalidTransaction: z.string()}),
  z.strictObject({Other: z.strictObject({error_message: z.string(), error_code: z.bigint()})}),
  z.strictObject({Processing: z.null()}),
  z.strictObject({TransactionTooOld: z.bigint()})
]);

export const NotifyTopUpResultSchema = z.union([
  z.strictObject({Ok: z.bigint()}),
  z.strictObject({Err: NotifyErrorSchema})
]);

/**
 * Arguments for the CMC `notify_top_up` call.
 */
export interface NotifyTopUpArgs {
  /** Index of the block on the ICP ledger that contains the payment. */
  block_index: bigint;
  /** The canister to top up. */
  canister_id: Principal;
}

/**
 * Errors that can occur during a CMC notify call.
 */
export type NotifyError =
  /** The payment was returned to the caller. */
  | {Refunded: {block_index?: bigint; reason: string}}
  /** The transaction does not satisfy the CMC payment protocol. */
  | {InvalidTransaction: string}
  /** Other error. */
  | {Other: {error_message: string; error_code: bigint}}
  /** The same payment is already being processed by a concurrent request. */
  | {Processing: null}
  /** The payment was too old to be processed. */
  | {TransactionTooOld: bigint};

/**
 * The result of a CMC `notify_top_up` call.
 * Returns the amount of cycles sent to the specified canister on success.
 */
export type NotifyTopUpResult = {Ok: bigint} | {Err: NotifyError};
