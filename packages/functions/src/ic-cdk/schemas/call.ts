import {IDL} from '@dfinity/candid';
import * as z from 'zod';
import {PrincipalSchema, RawPrincipalSchema} from '../../schemas/candid';

/**
 * Custom validation function to check if a value is an instance of `IDL.Type`.
 */
const IDLTypeSchema = z.custom<IDL.Type<unknown>>(
  (val) => val instanceof IDL.Type,
  {
    message: 'Invalid IDL.Type'
  }
);

/**
 * Schema for encoding function call arguments on the Internet Computer.
 *
 * Requests and responses on the IC are encoded using Candid.
 * This schema ensures that arguments are provided with both their value and type
 * to allow proper encoding.
 *
 * @see CallArgs
 */
export const CallArgsSchema = z.object({
  /**
   * The Candid types definition for the arguments.
   */
  types: z.array(IDLTypeSchema),

  /**
   * The actual argument values.
   */
  values: z.array(z.unknown())
});

/**
 * Type representing function call arguments on the IC.
 */
export type CallArgs = z.infer<typeof CallArgsSchema>;

/**
 * @see CallParams
 */
export const CallParamsSchema = z.object({
  /**
   * The target canister's ID.
   */
  canisterId: RawPrincipalSchema.or(PrincipalSchema),

  /**
   * The name of the method to call.
   */
  method: z.string().min(1),

  /**
   * The arguments - values and types - for the canister method.
   */
  args: CallArgsSchema,

  /**
   * The types of the results to decode the response.
   */
  results: CallArgsSchema.omit({values: true})
});

/**
 * Type representing the parameters required to make a canister call.
 */
export type CallParams = z.infer<typeof CallParamsSchema>;
