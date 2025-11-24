import {call} from '../../../ic-cdk/call.ic-cdk';
import {Canister} from '../../_canister';
import {type IcrcLedgerDid, IcrcLedgerIdl} from '../../declarations';
import {type IcrcCanisterOptions, IcrcCanisterOptionsSchema} from './schemas';

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
   * @param {IcrcLedgerDid.Account} account - The account to query.
   * @returns {Promise<IcrcLedgerDid.Tokens>} The token balance for the account.
   */
  icrc1BalanceOf = async ({
    account
  }: {
    account: IcrcLedgerDid.Account;
  }): Promise<IcrcLedgerDid.Tokens> =>
    await call<bigint>({
      canisterId: this.canisterId,
      method: 'icrc1_balance_of',
      args: [[IcrcLedgerIdl.Account, account]],
      result: IcrcLedgerIdl.Tokens
    });

  /**
   * Transfers tokens using the ICRC-1 `icrc1_transfer` method.
   *
   * Use this to send tokens from the caller's account to another account
   * when writing Juno Serverless Functions in TypeScript.
   *
   * @param {IcrcLedgerDid.TransferArg} args - Transfer arguments (amount, fee, to, memo, created_at_time, etc.).
   * @returns {Promise<IcrcLedgerDid.TransferResult>} The result of the transfer.
   */
  icrc1Transfer = async ({
    args
  }: {
    args: IcrcLedgerDid.TransferArg;
  }): Promise<IcrcLedgerDid.TransferResult> =>
    await call<IcrcLedgerDid.TransferResult>({
      canisterId: this.canisterId,
      method: 'icrc1_transfer',
      args: [[IcrcLedgerIdl.TransferArg, args]],
      result: IcrcLedgerIdl.TransferResult
    });

  /**
   * Transfers tokens using the ICRC-2 `icrc2_transfer_from` method.
   *
   * Allows transferring tokens from another user's account when an approval
   * has previously been granted via `icrc2_approve`.
   *
   * @param {IcrcLedgerDid.TransferFromArgs} args - Transfer-from arguments (amount, from_subaccount, spender, etc.).
   * @returns {Promise<IcrcLedgerDid.TransferFromResult>} The result of the transfer-from operation.
   */
  icrc2TransferFrom = async ({
    args
  }: {
    args: IcrcLedgerDid.TransferFromArgs;
  }): Promise<IcrcLedgerDid.TransferFromResult> =>
    await call<IcrcLedgerDid.TransferFromResult>({
      canisterId: this.canisterId,
      method: 'icrc2_transfer_from',
      args: [[IcrcLedgerIdl.TransferFromArgs, args]],
      result: IcrcLedgerIdl.TransferFromResult
    });
}
