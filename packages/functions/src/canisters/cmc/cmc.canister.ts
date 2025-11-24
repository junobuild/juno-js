import {Principal} from '@icp-sdk/core/principal';
import {call} from '../../ic-cdk/call.ic-cdk';
import {CanisterOptions, CanisterOptionsSchema} from '../_types';
import {Canister} from '../_canister';
import {CMC_ID} from '../_constants';
import {CmcDid, CmdIdl} from '../declarations';

export class CMCCanister extends Canister {
  constructor(options: CanisterOptions = {}) {
    CanisterOptionsSchema.parse(options);

    super({canisterId: options?.canisterId ?? CMC_ID});
  }

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
