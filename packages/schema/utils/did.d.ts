import * as z from 'zod';
export interface NullableParams {
    schema: z.core.$ZodType;
    value: unknown;
}
/**
 * Recursively converts a JavaScript value to its Candid nullable representation,
 * guided by a Zod schema.
 *
 * Optional and nullable fields are converted from `undefined` or `null` to `[]`,
 * and present values are wrapped in `[value]`. Objects and arrays are processed
 * recursively. Non-nullable primitives and unknown types are passed through as-is.
 *
 * @param {NullableParams} params - The schema and value to convert.
 * @param {z.core.$ZodType} params.schema - The Zod schema describing the value's structure.
 * @param {unknown} params.value - The JavaScript value to convert.
 * @returns {unknown} The value in Candid nullable format.
 *
 */
export declare const recursiveToNullable: ({ schema, value }: NullableParams) => unknown;
/**
 * Recursively converts a Candid nullable value back to its JavaScript representation,
 * guided by a Zod schema.
 *
 * Optional and nullable fields are converted from `[]` to `undefined` and from
 * `[value]` to `value`. Objects and arrays are processed recursively. Non-nullable
 * primitives and unknown types are passed through as-is.
 *
 * @param {NullableParams} params - The schema and value to convert.
 * @param {z.core.$ZodType} params.schema - The Zod schema describing the value's structure.
 * @param {unknown} params.value - The Candid nullable value to convert.
 * @returns {unknown} The value in JavaScript representation.
 *
 */
export declare const recursiveFromNullable: ({ schema, value }: NullableParams) => unknown;
