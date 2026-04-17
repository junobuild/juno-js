import type {Principal} from '@icp-sdk/core/principal';
import {j} from '@junobuild/schema';
import * as z from 'zod';
import {CanisterOptionsSchema} from '../../schemas';

/**
 * @see CanisterOptions
 */
export const IcrcCanisterOptionsSchema = CanisterOptionsSchema.required();

/**
 * The options to initialize an Icrc canister.
 */
export type IcrcCanisterOptions = z.infer<typeof IcrcCanisterOptionsSchema>;

export const SubaccountSchema = j.uint8Array();

export const AccountSchema = j.strictObject({
  owner: j.principal(),
  subaccount: SubaccountSchema.optional()
});

export const TokensSchema = j.bigint();

// icrc1_transfer
export const TransferArgSchema = j.strictObject({
  to: AccountSchema,
  fee: TokensSchema.optional(),
  memo: j.uint8Array().optional(),
  from_subaccount: SubaccountSchema.optional(),
  created_at_time: j.bigint().optional(),
  amount: TokensSchema
});

export const TransferErrorSchema = z.union([
  z.strictObject({GenericError: z.strictObject({message: z.string(), error_code: z.bigint()})}),
  z.strictObject({TemporarilyUnavailable: z.null()}),
  z.strictObject({BadBurn: z.strictObject({min_burn_amount: z.bigint()})}),
  z.strictObject({Duplicate: z.strictObject({duplicate_of: z.bigint()})}),
  z.strictObject({BadFee: z.strictObject({expected_fee: z.bigint()})}),
  z.strictObject({CreatedInFuture: z.strictObject({ledger_time: z.bigint()})}),
  z.strictObject({TooOld: z.null()}),
  z.strictObject({InsufficientFunds: z.strictObject({balance: z.bigint()})})
]);

export const TransferResultSchema = z.union([
  z.strictObject({Ok: z.bigint()}),
  z.strictObject({Err: TransferErrorSchema})
]);

// icrc2_transfer_from
export const TransferFromArgSchema = j.strictObject({
  to: AccountSchema,
  fee: TokensSchema.optional(),
  spender_subaccount: SubaccountSchema.optional(),
  from: AccountSchema,
  memo: j.uint8Array().optional(),
  created_at_time: j.bigint().optional(),
  amount: TokensSchema
});

export const TransferFromErrorSchema = z.union([
  z.strictObject({GenericError: z.strictObject({message: z.string(), error_code: z.bigint()})}),
  z.strictObject({TemporarilyUnavailable: z.null()}),
  z.strictObject({InsufficientAllowance: z.strictObject({allowance: z.bigint()})}),
  z.strictObject({BadBurn: z.strictObject({min_burn_amount: z.bigint()})}),
  z.strictObject({Duplicate: z.strictObject({duplicate_of: z.bigint()})}),
  z.strictObject({BadFee: z.strictObject({expected_fee: z.bigint()})}),
  z.strictObject({CreatedInFuture: z.strictObject({ledger_time: z.bigint()})}),
  z.strictObject({TooOld: z.null()}),
  z.strictObject({InsufficientFunds: z.strictObject({balance: z.bigint()})})
]);

export const TransferFromResultSchema = z.union([
  z.strictObject({Ok: z.bigint()}),
  z.strictObject({Err: TransferFromErrorSchema})
]);

/**
 * Subaccount is an arbitrary 32-byte array used to compute the source address.
 */
export type Subaccount = Uint8Array;

/**
 * An ICRC account, consisting of an owner principal and an optional subaccount.
 */
export interface Account {
  /** The account owner. */
  owner: Principal;
  /** An optional subaccount to distinguish multiple accounts for the same owner. */
  subaccount?: Subaccount;
}

/**
 * Errors that can occur during an ICRC-1 transfer.
 */
export type TransferError =
  /** An error not covered by the other variants. */
  | {GenericError: {message: string; error_code: bigint}}
  /** The ledger is temporarily unavailable. */
  | {TemporarilyUnavailable: null}
  /** The burn amount is below the minimum. */
  | {BadBurn: {min_burn_amount: bigint}}
  /** The transaction is a duplicate. */
  | {Duplicate: {duplicate_of: bigint}}
  /** The fee does not match the expected fee. */
  | {BadFee: {expected_fee: bigint}}
  /** The `created_at_time` is too far in the future. */
  | {CreatedInFuture: {ledger_time: bigint}}
  /** The transaction is too old. */
  | {TooOld: null}
  /** The account does not have enough funds. */
  | {InsufficientFunds: {balance: bigint}};

/**
 * The result of an ICRC-1 `icrc1_transfer` call.
 * Returns the block index of the transaction on success.
 */
export type TransferResult = {Ok: bigint} | {Err: TransferError};

/**
 * Arguments for the ICRC-1 `icrc1_transfer` call.
 */
export interface TransferArg {
  /** The destination account. */
  to: Account;
  /** An optional fee. Uses the default ledger fee if not provided. */
  fee?: bigint;
  /** An optional memo for the transaction. */
  memo?: Uint8Array;
  /** An optional subaccount to transfer from. Uses the default subaccount if not provided. */
  from_subaccount?: Subaccount;
  /** An optional timestamp. Uses current IC time if not provided. */
  created_at_time?: bigint;
  /** The amount to transfer. */
  amount: bigint;
}

/**
 * Errors that can occur during an ICRC-2 transfer-from.
 */
export type TransferFromError =
  /** An error not covered by the other variants. */
  | {GenericError: {message: string; error_code: bigint}}
  /** The ledger is temporarily unavailable. */
  | {TemporarilyUnavailable: null}
  /** The spender's allowance is insufficient. */
  | {InsufficientAllowance: {allowance: bigint}}
  /** The burn amount is below the minimum. */
  | {BadBurn: {min_burn_amount: bigint}}
  /** The transaction is a duplicate. */
  | {Duplicate: {duplicate_of: bigint}}
  /** The fee does not match the expected fee. */
  | {BadFee: {expected_fee: bigint}}
  /** The `created_at_time` is too far in the future. */
  | {CreatedInFuture: {ledger_time: bigint}}
  /** The transaction is too old. */
  | {TooOld: null}
  /** The account does not have enough funds. */
  | {InsufficientFunds: {balance: bigint}};

/**
 * The result of an ICRC-2 `icrc2_transfer_from` call.
 * Returns the block index of the transaction on success.
 */
export type TransferFromResult = {Ok: bigint} | {Err: TransferFromError};

/**
 * Arguments for the ICRC-2 `icrc2_transfer_from` call.
 */
export interface TransferFromArg {
  /** The destination account. */
  to: Account;
  /** An optional fee. Uses the default ledger fee if not provided. */
  fee?: bigint;
  /** An optional subaccount of the spender. */
  spender_subaccount?: Subaccount;
  /** The account to transfer from. */
  from: Account;
  /** An optional memo for the transaction. */
  memo?: Uint8Array;
  /** An optional timestamp. Uses current IC time if not provided. */
  created_at_time?: bigint;
  /** The amount to transfer. */
  amount: bigint;
}
