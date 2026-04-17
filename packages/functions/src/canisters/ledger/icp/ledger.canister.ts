import {schemaFromIdl, schemaToIdl} from '@junobuild/schema/utils';
import {call} from '../../../ic-cdk/call.ic-cdk';
import {Canister} from '../../_canister';
import {ICP_LEDGER_ID} from '../../_constants';
import {IcpLedgerIdl} from '../../declarations';
import {type CanisterOptions, CanisterOptionsSchema} from '../../schemas';
import {
  type TransferArgs,
  type TransferResult,
  TransferArgsSchema,
  TransferResultSchema
} from './schemas';

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

  /**
   * Sends ICP using the Ledger canister `transfer` method.
   *
   * Use this to transfer ICP from one account to another when writing
   * Juno Serverless Functions in TypeScript.
   *
   * @param {TransferArgs} args - The ledger transfer arguments (amount, destination account, memo, fee, etc.).
   * @returns {Promise<TransferResult>} The result of the ICP transfer.
   */
  transfer = async ({args}: {args: TransferArgs}): Promise<TransferResult> => {
    const parsed = TransferArgsSchema.parse(args);

    const idlArgs = schemaToIdl({
      schema: TransferArgsSchema,
      value: parsed
    });

    const idlResult = await call<TransferResult>({
      canisterId: this.canisterId,
      method: 'transfer',
      args: [[IcpLedgerIdl.TransferArgs, idlArgs]],
      result: IcpLedgerIdl.TransferResult
    });

    return schemaFromIdl({schema: TransferResultSchema, value: idlResult}) as TransferResult;
  };
}
