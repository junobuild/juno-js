import {core, z} from 'zod';

// Documentation and existing parsers related to Candid:
// https://zod.dev/json-schema
// https://github.com/dfinity/icp-js-bindgen/blob/main/src/core/generate/rs/src/bindings/typescript.rs
// https://github.com/slide-computer/candid-json/blob/main/src/index.ts

type JSONSchemaOutput = core.ZodStandardJSONSchemaPayload<any>;
type JSONSchema = core.JSONSchema.BaseSchema;

const jsonSchemaToCandid = (schema: JSONSchemaOutput | JSONSchema): string => {
  switch (schema.type) {
    case 'string':
      if (schema.enum !== undefined) {
        if (schema.enum.some((v) => typeof v !== 'string')) {
          throw new Error('Non-string enum values are not supported');
        }

        return `variant { ${schema.enum.join('; ')} }`;
      }

      return 'text';
    case 'boolean':
      return 'bool';
    case 'number':
      return 'float64';
    case 'integer':
      return schema.format === 'bigint' ? 'nat' : 'int32';
    case 'null':
      return 'null';

    case 'array': {
      if (schema.prefixItems !== undefined) {
        if (schema.prefixItems.some((item) => typeof item === 'boolean')) {
          throw new Error(`Boolean schema not supported.`);
        }

        const fields = schema.prefixItems
          .map((item, i) => `${i} : ${jsonSchemaToCandid(item as JSONSchema)}`)
          .join('; ');

        return `record { ${fields} }`;
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

      return `vec ${jsonSchemaToCandid(schema.items)}`;
    }

    case 'object': {
      // z.record() — no properties, has additionalProperties
      if (schema.properties === undefined && schema.additionalProperties !== undefined) {
        if (typeof schema.additionalProperties === 'boolean') {
          throw new Error('Boolean additionalProperties not supported');
        }
        return `vec record { text; ${jsonSchemaToCandid(schema.additionalProperties as JSONSchema)} }`;
      }

      if (schema.properties === undefined) {
        return 'record {}';
      }

      const required = new Set(schema.required ?? []);
      const entries = Object.entries(schema.properties);

      if (entries.some(([_, v]) => typeof v === 'boolean')) {
        throw new Error(`Boolean schema not supported.`);
      }

      const fields = entries
        .map(([k, v]) => {
          const type = jsonSchemaToCandid(v as JSONSchema);
          return required.has(k) ? `${k} : ${type}` : `${k} : opt ${type}`;
        })
        .join('; ');

      return `record { ${fields} }`;
    }
  }

  if (schema.oneOf !== undefined) {
    const variants = schema.oneOf.filter(({type}) => type !== 'null');

    if (variants.length === 1) {
      return `opt ${jsonSchemaToCandid(variants[0])}`;
    }

    return `variant { ${schema.oneOf.map(jsonSchemaToCandid).join('; ')} }`;
  }

  if (schema.anyOf !== undefined) {
    const nonBoolean = schema.anyOf.filter((s) => typeof s !== 'boolean') as JSONSchema[];

    // all members have const => variant with named tags
    if (nonBoolean.every((s) => s.const !== undefined)) {
      return `variant { ${nonBoolean.map((s) => String(s.const)).join('; ')} }`;
    }

    const nonEmpty = nonBoolean.filter((s) => Object.keys(s).length > 0);

    if (nonEmpty.length === 1) {
      return `opt ${jsonSchemaToCandid(nonEmpty[0])}`;
    }

    return `variant { ${nonEmpty.map((s) => jsonSchemaToCandid(s)).join('; ')} }`;
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
        const type = jsonSchemaToCandid(v as JSONSchema);
        return required.has(k) ? `${k} : ${type}` : `${k} : opt ${type}`;
      });
    });

    return `record { ${fields.join('; ')} }`;
  }

  if (Object.keys(schema).length === 0) {
    throw new Error(
      'Unsupported type: unrepresentable schema (z.symbol, z.undefined, z.void, z.map, z.set, z.nan, z.custom are not supported)'
    );
  }

  throw new Error(`Unsupported JSON Schema: ${JSON.stringify(schema)}`);
};

export const zodToCandid = (inputs: Record<string, z.ZodType>): string =>
  Object.entries(inputs)
    .map(([id, schema]) => {
      const json = schema.toJSONSchema({
        unrepresentable: 'any',
        override: (ctx) => {
          if (ctx.zodSchema._zod.def.type === 'bigint') {
            ctx.jsonSchema.type = 'integer';
            // https://json-schema.org/understanding-json-schema/reference/type#format
            ctx.jsonSchema.format = 'bigint';
          }
        }
      });

      return `type ${id} = ${jsonSchemaToCandid(json)};`;
    })
    .join('\n');

// const testSchema = z
//   .strictObject({
//     yolo: z.string().max(1),
//     what: z.object({
//       woot: z.string().max(1)
//     })
//   })
//   .meta({id: 'testSchema'});
//
// const anotherSchema = z.object({
//   mmmm: z.int(),
//   world: z.bigint().min(1n).optional(),
//   whatever: z.union([z.literal('yolo'), z.literal('yala')]),
//   popo_popopo: z.enum(['a', 'b', 'c'])
// });
//
// const moreSchemas = z.object({
//   tuple: z.tuple([z.string(), z.number()]),
//   rec: z.record(z.string(), z.number()),
//   inter: z.intersection(z.object({a: z.string()}), z.object({b: z.number()}))
// });
//
// const result = zodToCandid({
//   TestSchema: testSchema,
//   AnotherSchema: anotherSchema,
//   MoreSchemas: moreSchemas
// });
//
// console.log(result);
