import type {Principal} from '@icp-sdk/core/principal';
import {call} from '../../ic-cdk/call.ic-cdk';
import {Canister} from '../_canister';
import {CMC_ID} from '../_constants';
import {type CanisterOptions, CanisterOptionsSchema} from '../_schemas';
import {type CmcDid, CmdIdl} from '../declarations';

/**
 * Provides a simple interface to interact with the Cycle Minting Canister,
 * when developing Juno Serverless Functions in TypeScript.
 *
 * @param {CanisterOptions} [options] - Optional custom canister ID.
 */
export class CMCCanister extends Canister {
  constructor(options: CanisterOptions = {}) {
    CanisterOptionsSchema.parse(options);

    super({canisterId: options?.canisterId ?? CMC_ID});
  }

  /**
   * Notifies the Cycle Minting Canister (CMC) that a top-up transfer has been completed.
   *
   * After sending ICP to the CMC top-up account for a canister, the transfer is recorded
   * on the ledger. The CMC does not automatically convert that ICP into cycles — you
   * must call this function to let the CMC know which transaction to process.
   *
   * The CMC will then convert the ICP from the given ledger block into cycles and add
   * them to the specified canister.
   *
   * @param {bigint} blockIndex - The ledger block index where the ICP transfer was recorded.
   * @param {Principal} targetCanisterId - The canister that should receive the cycles.
   *
   * @returns {Promise<CmcDid.NotifyTopUpResult>} The result of the CMC conversion and deposit.
   */
  notifyTopUp = async ({
    blockIndex,
    targetCanisterId
  }: {
    blockIndex: bigint;
    targetCanisterId: Principal;
  }): Promise<CmcDid.NotifyTopUpResult> => {
    const args: CmcDid.NotifyTopUpArg = {
      block_index: blockIndex,
      canister_id: targetCanisterId
    };

    return await call<CmcDid.NotifyTopUpResult>({
      canisterId: this.canisterId,
      method: 'notify_top_up',
      args: [[CmdIdl.NotifyTopUpArg, args]],
      result: CmdIdl.NotifyTopUpResult
    });
  };
}
