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

export type Account = j.infer<typeof AccountSchema>;

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

export type TransferArg = j.infer<typeof TransferArgSchema>;
export type TransferResult = z.infer<typeof TransferResultSchema>;

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

export type TransferFromArg = j.infer<typeof TransferFromArgSchema>;
export type TransferFromResult = z.infer<typeof TransferFromResultSchema>;