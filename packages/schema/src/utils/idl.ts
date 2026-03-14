import * as z from 'zod';

export interface IdlParams {
  schema: z.core.$ZodType;
  value: unknown;
}

/**
 * Recursively converts a JavaScript value to its Candid IDL representation,
 * guided by a Zod schema.
 *
 * Discriminated unions are converted from `{ type: "active", owner: ... }` to
 * `{ active: { owner: ... } }` to match the Candid variant shape.
 * Optional and nullable fields are converted from `undefined` or `null` to `[]`,
 * and present values are wrapped in `[value]`. Objects and arrays are processed
 * recursively. Non-nullable primitives and unknown types are passed through as-is.
 *
 * @param {IdlParams} params - The schema and value to convert.
 * @param {z.core.$ZodType} params.schema - The Zod schema describing the value's structure.
 * @param {unknown} params.value - The JavaScript value to convert.
 * @returns {unknown} The value in Candid IDL format.
 */
export const schemaToIdl = ({schema, value}: IdlParams): unknown => {
  if (schema instanceof z.ZodDiscriminatedUnion) {
    const {discriminator} = schema._zod.def;
    const obj = value as Record<string, unknown>;
    const tag = obj[discriminator];

    if (typeof tag !== 'string') {
      throw new Error(`Expected discriminator field "${discriminator}" to be a string`);
    }

    const {[discriminator]: _, ...rest} = obj;

    const variantSchema = schema._zod.def.options.find(
      (o: z.core.$ZodType) =>
        o instanceof z.ZodObject &&
        o._zod.def.shape[discriminator] instanceof z.ZodLiteral &&
        o._zod.def.shape[discriminator]._zod.def.values.includes(tag)
    );

    return {
      [tag]: variantSchema !== undefined ? schemaToIdl({schema: variantSchema, value: rest}) : rest
    };
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return value === undefined || value === null
      ? []
      : [schemaToIdl({schema: schema._zod.def.innerType, value})];
  }

  if (schema instanceof z.ZodObject) {
    return Object.fromEntries(
      Object.entries(schema._zod.def.shape).map(([k, t]) => [
        k,
        schemaToIdl({schema: t as z.core.$ZodType, value: (value as Record<string, unknown>)[k]})
      ])
    );
  }

  if (schema instanceof z.ZodArray) {
    return (value as unknown[]).map((v) =>
      schemaToIdl({schema: schema._zod.def.element, value: v})
    );
  }

  return value;
};

/**
 * Recursively converts a Candid IDL value back to its JavaScript representation,
 * guided by a Zod schema.
 *
 * Discriminated unions are converted from `{ active: { owner: ... } }` back to
 * `{ type: "active", owner: ... }` to match the Zod discriminated union shape.
 * Optional and nullable fields are converted from `[]` to `undefined` and from
 * `[value]` to `value`. Objects and arrays are processed recursively.
 * Non-nullable primitives and unknown types are passed through as-is.
 *
 * @param {IdlParams} params - The schema and value to convert.
 * @param {z.core.$ZodType} params.schema - The Zod schema describing the value's structure.
 * @param {unknown} params.value - The Candid IDL value to convert.
 * @returns {unknown} The value in JavaScript representation.
 */
export const schemaFromIdl = ({schema, value}: IdlParams): unknown => {
  if (schema instanceof z.ZodDiscriminatedUnion) {
    const {discriminator} = schema._zod.def;
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);

    if (keys.length !== 1) {
      throw new Error(`Expected exactly one key in variant object, got: ${keys.join(', ')}`);
    }

    const tag = keys[0];
    const inner = obj[tag];

    if (typeof inner !== 'object' || inner === null) {
      throw new Error(`Expected variant value for "${tag}" to be an object`);
    }

    const variantSchema = schema._zod.def.options.find(
      (o: z.core.$ZodType) =>
        o instanceof z.ZodObject &&
        o._zod.def.shape[discriminator] instanceof z.ZodLiteral &&
        o._zod.def.shape[discriminator]._zod.def.values.includes(tag)
    );

    const reconstructed =
      variantSchema !== undefined
        ? (schemaFromIdl({
            schema: variantSchema,
            value: {[discriminator]: tag, ...(inner as Record<string, unknown>)}
          }) as Record<string, unknown>)
        : {[discriminator]: tag, ...(inner as Record<string, unknown>)};

    return reconstructed;
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    const arr = value as [] | [unknown];
    return arr.length === 0
      ? undefined
      : schemaFromIdl({schema: schema._zod.def.innerType, value: arr[0]});
  }

  if (schema instanceof z.ZodObject) {
    return Object.fromEntries(
      Object.entries(schema._zod.def.shape).map(([k, t]) => [
        k,
        schemaFromIdl({schema: t as z.core.$ZodType, value: (value as Record<string, unknown>)[k]})
      ])
    );
  }

  if (schema instanceof z.ZodArray) {
    return (value as unknown[]).map((v) =>
      schemaFromIdl({schema: schema._zod.def.element, value: v})
    );
  }

  return value;
};
