import {type z, ZodNullable} from 'zod';
import type {JSONSchema, JSONSchemaOutput, SputnikSchema} from './_types';

export interface ConvertedSputnikSchema {
  id: string;
  schema: SputnikSchema;
  isTopLevelOptional: boolean;
}

export type SputnikSchemaResult = ConvertedSputnikSchema[];

export interface SputnikSchemaArgs {
  inputs: Record<string, z.ZodType>;
}

export const jsonToSputnikSchema = ({inputs}: SputnikSchemaArgs): SputnikSchemaResult =>
  Object.entries(inputs).map(([id, zodSchema]) => {
    const json = zodSchema.toJSONSchema({
      unrepresentable: 'any',
      override: (ctx) => {
        if (ctx.zodSchema._zod.def.type === 'bigint') {
          ctx.jsonSchema.type = 'integer';
          // https://json-schema.org/understanding-json-schema/reference/type#format
          ctx.jsonSchema.format = 'bigint';
        }

        if (ctx.jsonSchema.id === 'Principal') {
          ctx.jsonSchema.format = 'principal';
        }
      }
    });

    const sputnikSchema = jsonToSchema(json);

    // Zod strips optional from JSON Schema output, so we need to re-add the opt wrapper.
    // However, nullish (optional + nullable) is already handled by the anyOf handler, so we skip it.
    // e.g. z.string().nullish())
    const isTopLevelOptional =
      zodSchema._zod.def.type === 'optional' &&
      !('innerType' in zodSchema._zod.def && zodSchema._zod.def.innerType instanceof ZodNullable);

    return {
      id,
      schema: sputnikSchema,
      isTopLevelOptional
    };
  });

const jsonToSchema = (schema: JSONSchemaOutput | JSONSchema): SputnikSchema => {
  if (schema.format === 'principal') {
    return {kind: 'principal'};
  }

  switch (schema.type) {
    case 'string':
      if (schema.const !== undefined) {
        return {kind: 'variant', tags: [String(schema.const)]};
      }

      if (schema.enum !== undefined) {
        if (schema.enum.some((v) => typeof v !== 'string')) {
          throw new Error('Non-string enum values are not supported');
        }

        return {kind: 'variant', tags: schema.enum as string[]};
      }

      return {kind: 'text'};

    case 'boolean':
      return {kind: 'bool'};

    case 'number':
      return {kind: 'float64'};

    case 'integer':
      return schema.format === 'bigint' ? {kind: 'nat'} : {kind: 'int32'};

    case 'null':
      throw new Error('null type is not supported');

    case 'array': {
      if (schema.prefixItems !== undefined) {
        if (schema.prefixItems.some((item) => typeof item === 'boolean')) {
          throw new Error(`Boolean schema not supported.`);
        }

        return {
          kind: 'indexedTuple',
          members: schema.prefixItems.map((item) => jsonToSchema(item as JSONSchema))
        };
      }

      if (schema.items === undefined) {
        throw new Error('Array schema must have items defined');
      }

      if (Array.isArray(schema.items)) {
        throw new Error('Tuple-style array items not supported');
      }

      if (typeof schema.items === 'boolean') {
        throw new Error('Boolean schema not supported for array items');
      }

      return {kind: 'vec', inner: jsonToSchema(schema.items)};
    }

    case 'object': {
      // z.record() — no properties, has additionalProperties
      if (schema.properties === undefined && schema.additionalProperties !== undefined) {
        if (typeof schema.additionalProperties === 'boolean') {
          throw new Error('Boolean additionalProperties not supported');
        }

        return {
          kind: 'vec',
          inner: {
            kind: 'tuple',
            members: [{kind: 'text'}, jsonToSchema(schema.additionalProperties)]
          }
        };
      }

      if (schema.properties === undefined) {
        return {kind: 'record', fields: []};
      }

      if (Object.keys(schema.properties).length === 0) {
        return {kind: 'record', fields: []};
      }

      const required = new Set(schema.required ?? []);
      const entries = Object.entries(schema.properties);

      if (entries.some(([_, v]) => typeof v === 'boolean')) {
        throw new Error(`Boolean schema not supported.`);
      }

      return {
        kind: 'record',
        fields: entries.map(([k, v]) => {
          const type = jsonToSchema(v as JSONSchema);
          return {name: k, type: required.has(k) ? type : {kind: 'opt', inner: type}};
        })
      };
    }
  }

  if (schema.oneOf !== undefined) {
    const variants = schema.oneOf.filter(({type}) => type !== 'null');

    if (variants.length === 1) {
      return {kind: 'opt', inner: jsonToSchema(variants[0])};
    }

    return {kind: 'variantRecords', members: variants.map(jsonToSchema)};
  }

  if (schema.anyOf !== undefined) {
    const nonBoolean = schema.anyOf.filter((s) => typeof s !== 'boolean');

    const empty = nonBoolean.filter((s) => Object.keys(s).length === 0);
    if (empty.length > 0) {
      throw new Error('Unrepresentable type in union');
    }

    if (nonBoolean.every((s) => s.const !== undefined)) {
      return {kind: 'variant', tags: nonBoolean.map((s) => String(s.const))};
    }

    const nonNull = nonBoolean.filter((s) => s.type !== 'null');

    if (nonNull.length === 1) {
      return {kind: 'opt', inner: jsonToSchema(nonNull[0])};
    }

    return {kind: 'variantRecords', members: nonNull.map(jsonToSchema)};
  }

  if (schema.allOf !== undefined) {
    if (schema.allOf.some((s) => typeof s === 'boolean')) {
      throw new Error('Boolean schema not supported in allOf');
    }

    if (
      schema.allOf.some(
        (s) => typeof s !== 'boolean' && (s.type !== 'object' || s.properties === undefined)
      )
    ) {
      throw new Error('allOf only supported for object types');
    }

    const fields = schema.allOf.flatMap((s) => {
      const required = new Set(s.required ?? []);
      return Object.entries(s.properties ?? {}).map(([k, v]) => {
        const type = jsonToSchema(v as JSONSchema);
        return {name: k, type: required.has(k) ? type : {kind: 'opt' as const, inner: type}};
      });
    });

    return {kind: 'record', fields};
  }

  if (Object.keys(schema).length === 0) {
    throw new Error(
      'Unsupported type: unrepresentable schema (z.symbol, z.undefined, z.void, z.map, z.set, z.nan, z.custom are not supported)'
    );
  }

  throw new Error(`Unsupported JSON Schema: ${JSON.stringify(schema)}`);
};
