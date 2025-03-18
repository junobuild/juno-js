import {IDL} from '@dfinity/candid';
import * as z from 'zod';
import {PrincipalSchema, RawPrincipalSchema} from '../../schemas/candid';

/**
 * @see IDLType
 */
export const IDLTypeSchema = z.custom<IDL.Type<unknown>>((val) => val instanceof IDL.Type, {
  message: 'Invalid IDL.Type'
});

/**
 * Custom validation function to verify if a value is an instance of `IDL.Type` from `@dfinity/candid`.
 */
export type IDLType = z.infer<typeof IDLTypeSchema>;

/**
 * @see CallArg
 */
export const CallArgSchema = z.tuple([IDLTypeSchema, z.unknown()]);

/**
 * A call argument consisting of its IDL type and corresponding value.
 */
export type CallArg = z.infer<typeof CallArgSchema>;

/**
 * Schema for encoding the call arguments.
 *
 * @see CallArgs
 */
export const CallArgsSchema = z.array(CallArgSchema);

/**
 * Represents the arguments for a canister call on the IC.
 *
 * Requests and responses on the IC are encoded using Candid.
 * This schema ensures that each argument is provided with both its type and value
 * for proper encoding.
 *
 * The order of arguments is preserved for the function call.
 */
export type CallArgs = z.infer<typeof CallArgsSchema>;

/**
 * @see CallResult
 */
export const CallResultSchema = IDLTypeSchema;

/**
 * Defines the type used to decode the result of a canister call.
 */
export type CallResult = z.infer<typeof CallResultSchema>;

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
   * The arguments, including types and values, for the canister call.
   */
  args: CallArgsSchema.optional(),

  /**
   * The expected result type used for decoding the response.
   */
  result: CallResultSchema.optional()
});

/**
 * Type representing the parameters required to make a canister call.
 */
export type CallParams = z.infer<typeof CallParamsSchema>;
