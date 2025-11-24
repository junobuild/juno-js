import {Principal} from '@icp-sdk/core/principal';
import * as z from 'zod';
import {PrincipalSchema} from '../schemas/candid';

/**
 * @see CanisterParameters
 */
export const CanisterParametersSchema = z.strictObject({
  canisterId: PrincipalSchema
});

/**
 * The parameters that define a canister.
 */
export type CanisterParameters = z.infer<typeof CanisterParametersSchema>;

export abstract class Canister {
  readonly #id: Principal;

  protected constructor({canisterId}: CanisterParameters) {
    this.#id = canisterId;
  }

  get canisterId(): Principal {
    return this.#id;
  }
}
