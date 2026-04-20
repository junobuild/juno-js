import {schemaFromIdl, schemaToIdl} from '@junobuild/schema/utils';
import {call} from '../../../ic-cdk/call.ic-cdk';
import {Canister} from '../../_canister';
import {IcrcLedgerIdl} from '../../declarations';
import {
  AccountSchema,
  ApproveArgsSchema,
  ApproveResultSchema,
  IcrcCanisterOptionsSchema,
  TransferArgsSchema,
  TransferFromArgsSchema,
  TransferFromResultSchema,
  TransferResultSchema,
  type Account,
  type ApproveArgs,
  type ApproveResult,
  type IcrcCanisterOptions,
  type TransferArgs,
  type TransferFromArgs,
  type TransferFromResult,
  type TransferResult
} from './schema';

/**
 * Provides a simple interface to interact with an ICRC Ledger,
 * when developing Juno Serverless Functions in TypeScript.
 *
 * @param {CanisterOptions} [options] - The options providing the ICRC ledger canister ID.
 */
export class IcrcLedgerCanister extends Canister {
  constructor(options: IcrcCanisterOptions) {
    IcrcCanisterOptionsSchema.parse(options);

    super({canisterId: options.canisterId});
  }

  /**
   * Returns the balance of an ICRC account.
   *
   * @param {Account} account - The account to query.
   * @returns {Promise<bigint>} The token balance for the account.
   */
  icrc1BalanceOf = async ({account}: {account: Account}): Promise<bigint> => {
    const parsed = AccountSchema.parse(account);
    const idlArgs = schemaToIdl({schema: AccountSchema, value: parsed});

    return await call<bigint>({
      canisterId: this.canisterId,
      method: 'icrc1_balance_of',
      args: [[IcrcLedgerIdl.Account, idlArgs]],
      result: IcrcLedgerIdl.Tokens
    });
  };

  /**
   * Transfers tokens using the ICRC-1 `icrc1_transfer` method.
   *
   * Use this to send tokens from the caller's account to another account
   * when writing Juno Serverless Functions in TypeScript.
   *
   * @param {TransferArgs} args - Transfer arguments (amount, fee, to, memo, created_at_time, etc.).
   * @returns {Promise<TransferResult>} The result of the transfer.
   */
  icrc1Transfer = async ({args}: {args: TransferArgs}): Promise<TransferResult> => {
    const parsed = TransferArgsSchema.parse(args);
    const idlArgs = schemaToIdl({schema: TransferArgsSchema, value: parsed});

    const idlResult = await call<TransferResult>({
      canisterId: this.canisterId,
      method: 'icrc1_transfer',
      args: [[IcrcLedgerIdl.TransferArg, idlArgs]],
      result: IcrcLedgerIdl.TransferResult
    });

    return schemaFromIdl({schema: TransferResultSchema, value: idlResult}) as TransferResult;
  };

  /**
   * Transfers tokens using the ICRC-2 `icrc2_transfer_from` method.
   *
   * Allows transferring tokens from another user's account when an approval
   * has previously been granted via `icrc2_approve`.
   *
   * @param {TransferFromArgs} args - Transfer-from arguments (amount, from_subaccount, spender, etc.).
   * @returns {Promise<TransferFromResult>} The result of the transfer-from operation.
   */
  icrc2TransferFrom = async ({args}: {args: TransferFromArgs}): Promise<TransferFromResult> => {
    const parsed = TransferFromArgsSchema.parse(args);
    const idlArgs = schemaToIdl({schema: TransferFromArgsSchema, value: parsed});

    const idlResult = await call<TransferFromResult>({
      canisterId: this.canisterId,
      method: 'icrc2_transfer_from',
      args: [[IcrcLedgerIdl.TransferFromArgs, idlArgs]],
      result: IcrcLedgerIdl.TransferFromResult
    });

    return schemaFromIdl({
      schema: TransferFromResultSchema,
      value: idlResult
    }) as TransferFromResult;
  };

  /**
   * Approves a spender to transfer tokens on behalf of the caller using the ICRC-2 `icrc2_approve` method.
   *
   * @param {ApproveArgs} args - Approve arguments (amount, spender, fee, expires_at, etc.).
   * @returns {Promise<ApproveResult>} The result of the approval.
   */
  icrc2Approve = async ({args}: {args: ApproveArgs}): Promise<ApproveResult> => {
    const parsed = ApproveArgsSchema.parse(args);
    const idlArgs = schemaToIdl({schema: ApproveArgsSchema, value: parsed});

    const idlResult = await call<ApproveResult>({
      canisterId: this.canisterId,
      method: 'icrc2_approve',
      args: [[IcrcLedgerIdl.ApproveArgs, idlArgs]],
      result: IcrcLedgerIdl.ApproveResult
    });

    return schemaFromIdl({schema: ApproveResultSchema, value: idlResult}) as ApproveResult;
  };
}
