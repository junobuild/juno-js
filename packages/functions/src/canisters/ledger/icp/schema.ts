import {j} from '@junobuild/schema';
import * as z from 'zod';

export const AccountIdentifierSchema = j.instanceof(Uint8Array);
export const TokensSchema = j.strictObject({e8s: j.bigint()});
export const TimeStampSchema = j.strictObject({timestamp_nanos: j.bigint()});
export const SubAccountSchema = j.instanceof(Uint8Array);

export const TransferArgsSchema = j.strictObject({
  to: AccountIdentifierSchema,
  fee: TokensSchema,
  memo: j.bigint(),
  from_subaccount: SubAccountSchema.optional(),
  created_at_time: TimeStampSchema.optional(),
  amount: TokensSchema
});

export const TransferErrorSchema = z.union([
  z.strictObject({TxTooOld: z.strictObject({allowed_window_nanos: z.bigint()})}),
  z.strictObject({BadFee: z.strictObject({expected_fee: z.strictObject({e8s: z.bigint()})})}),
  z.strictObject({TxDuplicate: z.strictObject({duplicate_of: z.bigint()})}),
  z.strictObject({TxCreatedInFuture: z.null()}),
  z.strictObject({InsufficientFunds: z.strictObject({balance: z.strictObject({e8s: z.bigint()})})})
]);

export const TransferResultSchema = z.union([
  z.strictObject({Ok: z.bigint()}),
  z.strictObject({Err: TransferErrorSchema})
]);

/**
 * The destination account identifier.
 * A 32-byte array where the first 4 bytes are a CRC32 checksum of the last 28 bytes.
 */
export type AccountIdentifier = Uint8Array;

/**
 * Amount of tokens, measured in 10^-8 of a token.
 */
export interface Tokens {
  e8s: bigint;
}

/**
 * A point in time, represented as nanoseconds since the Unix epoch.
 */
export interface TimeStamp {
  timestamp_nanos: bigint;
}

/**
 * Subaccount is an arbitrary 32-byte array used to compute the source address.
 */
export type SubAccount = Uint8Array;

/**
 * Arguments for the ICP Ledger `transfer` call.
 */
export interface TransferArgs {
  /** The destination account identifier. */
  to: AccountIdentifier;
  /** The transaction fee. Must be 10000 e8s. */
  fee: Tokens;
  /** An arbitrary number associated with the transaction for correlation. */
  memo: bigint;
  /** The subaccount to transfer from. Uses the default subaccount if not provided. */
  from_subaccount?: SubAccount;
  /** The time at which the caller created this request. Uses current IC time if not provided. */
  created_at_time?: TimeStamp;
  /** The amount to transfer to the destination address. */
  amount: Tokens;
}

/**
 * Errors that can occur during an ICP Ledger transfer.
 */
export type TransferError =
  /** The request is too old. The ledger only accepts requests created within a 24-hour window. */
  | {TxTooOld: {allowed_window_nanos: bigint}}
  /** The fee specified in the transfer request does not match the expected fee. */
  | {BadFee: {expected_fee: Tokens}}
  /** The ledger has already executed this request. */
  | {TxDuplicate: {duplicate_of: bigint}}
  /** The specified `created_at_time` is too far in the future. */
  | {TxCreatedInFuture: null}
  /** The caller's account does not have enough funds. */
  | {InsufficientFunds: {balance: Tokens}};

/**
 * The result of an ICP Ledger `transfer` call.
 * Returns the block index of the transaction on success.
 */
export type TransferResult = {Ok: bigint} | {Err: TransferError};
