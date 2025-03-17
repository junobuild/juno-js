import * as z from 'zod';
import {PrincipalSchema, RawPrincipalSchema} from "../../schemas/candid";
import {IDL} from "@dfinity/candid";

/**
 * Custom validation function to check if a value is an instance of `IDL.Type`.
 */
const IDLTypeSchema = z.custom<IDL.Type<unknown>>((val) => {
    return val instanceof IDL.Type;
}, {
    message: "Invalid IDL.Type",
});

/**
 * Schema for encoding function call arguments on the Internet Computer.
 *
 * Requests and responses on the IC are encoded using Candid.
 * This schema ensures that arguments are provided with both their value and type
 * to allow proper encoding.
 *
 * @see CallArgs
 */
export const CallArgsSchema = z
    .object({
        /**
         * The Candid type definition for the arguments.
         */
        type: IDLTypeSchema,

        /**
         * The actual argument values.
         */
        value: z.unknown()
    });

/**
 * Type representing function call arguments on the IC.
 */
export type CallArgs = z.infer<typeof CallArgsSchema>;

/**
 * @see CallParams
 */
export const CallParamsSchema = z
    .object({
        /**
         * The target canister's ID.
         */
        canisterId: RawPrincipalSchema.or(PrincipalSchema),

        /**
         * The name of the method to call.
         */
        method: z.string().min(1),

        /**
         * The arguments - value and type - for the canister method.
         */
        args: CallArgsSchema,
    });

/**
 * Type representing the parameters required to make a canister call.
 */
export type CallParams = z.infer<typeof CallParamsSchema>;