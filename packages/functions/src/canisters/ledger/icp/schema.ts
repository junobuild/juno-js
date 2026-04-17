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

export type TransferArgs = j.infer<typeof TransferArgsSchema>;
export type TransferResult = j.infer<typeof TransferResultSchema>;
