import {call} from '../../../ic-cdk/call.ic-cdk';
import {Canister} from '../../_canister';
import {ICP_LEDGER_ID} from '../../_constants';
import {type CanisterOptions, CanisterOptionsSchema} from '../../_schemas';
import {type IcpLedgerDid, IcpLedgerIdl} from '../../declarations';

/**
 * Provides a simple interface to interact with the ICP Ledger,
 * when developing Juno Serverless Functions in TypeScript.
 *
 * @param {CanisterOptions} [options] - Optional custom canister ID.
 */
export class IcpLedgerCanister extends Canister {
  constructor(options: CanisterOptions = {}) {
    CanisterOptionsSchema.parse(options);

    super({canisterId: options?.canisterId ?? ICP_LEDGER_ID});
  }

  transfer = async ({
    args
  }: {
    args: IcpLedgerDid.TransferArgs;
  }): Promise<IcpLedgerDid.TransferResult> => await call<IcpLedgerDid.TransferResult>({
      canisterId: this.canisterId,
      method: 'transfer',
      args: [[IcpLedgerIdl.TransferArgs, args]],
      result: IcpLedgerIdl.TransferResult
    });
}
