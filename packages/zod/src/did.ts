import * as z from 'zod';

interface NullableParams {
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
export const recursiveToNullable = ({schema, value}: NullableParams): unknown => {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return value === undefined || value === null
      ? []
      : [recursiveToNullable({schema: schema._zod.def.innerType, value})];
  }

  if (schema instanceof z.ZodObject) {
    return Object.fromEntries(
      Object.entries(schema._zod.def.shape).map(([k, t]) => [
        k,
        recursiveToNullable({
          schema: t as z.core.$ZodType,
          value: (value as Record<string, unknown>)[k]
        })
      ])
    );
  }

  if (schema instanceof z.ZodArray) {
    return (value as unknown[]).map((value) =>
      recursiveToNullable({schema: schema._zod.def.element, value})
    );
  }

  return value;
};

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
export const recursiveFromNullable = ({schema, value}: NullableParams): unknown => {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    const arr = value as [] | [unknown];
    return arr.length === 0
      ? undefined
      : recursiveFromNullable({
          schema: schema._zod.def.innerType,
          value: arr[0]
        });
  }

  if (schema instanceof z.ZodObject) {
    return Object.fromEntries(
      Object.entries(schema._zod.def.shape).map(([k, t]) => [
        k,
        recursiveFromNullable({
          schema: t as z.core.$ZodType,
          value: (value as Record<string, unknown>)[k]
        })
      ])
    );
  }

  if (schema instanceof z.ZodArray) {
    return (value as unknown[]).map((value) =>
      recursiveFromNullable({
        schema: schema._zod.def.element,
        value
      })
    );
  }

  return value;
};
