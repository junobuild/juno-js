import {schemaFromIdl, schemaToIdl} from '@junobuild/schema/utils';
import {call} from '../../ic-cdk/call.ic-cdk';
import {Canister} from '../_canister';
import {CMC_ID} from '../_constants';
import {CmcIdl} from '../declarations';
import {type CanisterOptions, CanisterOptionsSchema} from '../schema';
import {
  type NotifyTopUpArg,
  type NotifyTopUpResult,
  NotifyTopUpArgSchema,
  NotifyTopUpResultSchema
} from './schema';

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
   * @param {NotifyTopUpArg} args - Arguments containing the ledger block index and the canister ID that should receive the cycles.
   * @returns {Promise<NotifyTopUpResult>} The result of the CMC conversion and deposit.
   */
  notifyTopUp = async ({args}: {args: NotifyTopUpArg}): Promise<NotifyTopUpResult> => {
    const parsed = NotifyTopUpArgSchema.parse(args);

    const idlArgs = schemaToIdl({schema: NotifyTopUpArgSchema, value: parsed});

    const idlResult = await call<NotifyTopUpResult>({
      canisterId: this.canisterId,
      method: 'notify_top_up',
      args: [[CmcIdl.NotifyTopUpArg, idlArgs]],
      result: CmcIdl.NotifyTopUpResult
    });

    return schemaFromIdl({schema: NotifyTopUpResultSchema, value: idlResult}) as NotifyTopUpResult;
  };
}
