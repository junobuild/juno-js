import type {Principal} from '@icp-sdk/core/principal';
import {j} from '@junobuild/schema';
import * as z from 'zod';

/**
 * @see CanisterParameters
 */
export const CanisterParametersSchema = z.strictObject({
  canisterId: j.principal()
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
