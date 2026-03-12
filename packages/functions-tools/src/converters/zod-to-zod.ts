import {capitalize} from '@junobuild/utils';
import type {z} from 'zod';
import {jsonToSputnikSchema, type SputnikSchemaResult} from './_converters';
import type {SputnikSchema} from './_types';

const schemaToZodString = (schema: SputnikSchema): string => {
  switch (schema.kind) {
    case 'text':
      return 'z.string()';
    case 'bool':
      return 'z.boolean()';
    case 'float64':
      return 'z.number()';
    case 'int32':
      return 'z.int()';
    case 'nat':
      return 'z.bigint()';
    case 'principal':
      return 'PrincipalSchema';
    case 'uint8array':
      return 'Uint8ArraySchema';
    case 'opt':
      return `z.optional(${schemaToZodString(schema.inner)})`;
    case 'vec':
      return `z.array(${schemaToZodString(schema.inner)})`;
    case 'tuple':
    case 'indexedTuple':
      return `z.tuple([${schema.members.map(schemaToZodString).join(', ')}])`;
    case 'record':
      return `z.strictObject({${schema.fields.map((f) => `${f.name}: ${schemaToZodString(f.type)}`).join(', ')}})`;
    case 'variant':
      return `z.enum([${schema.tags.map((t) => `'${t}'`).join(', ')}])`;
    case 'variantRecords':
      return `z.union([${schema.members.map(schemaToZodString).join(', ')}])`;
  }
};

export interface ZodResult {
  baseName: string;
  code: string;
}

const sputnikSchemaToZod = ({
  id,
  schema,
  isTopLevelOptional,
  suffix
}: SputnikSchemaResult & {suffix: 'Args' | 'Result'}): ZodResult => {
  const baseName = `${capitalize(id)}${suffix}`;
  const resolvedSchema: SputnikSchema = isTopLevelOptional ? {kind: 'opt', inner: schema} : schema;
  const zodString = schemaToZodString(resolvedSchema);

  return {
    baseName,
    code: `const ${baseName}Schema = ${zodString};`
  };
};

/**
 * Converts a Zod schema to a Zod schema source code string.
 *
 * @param {string} id - The base name used to generate the schema constant name.
 * @param {z.ZodType} schema - The Zod schema to convert.
 * @param {'Args' | 'Result'} suffix - Whether this represents function arguments or a return type.
 * @returns {ZodResult} An object containing the generated code and the base type name.
 */
export const zodToZod = ({
  id,
  schema,
  suffix
}: {
  id: string;
  schema: z.ZodType;
  suffix: 'Args' | 'Result';
}): ZodResult => {
  const converted = jsonToSputnikSchema({zodSchema: schema, id});
  return sputnikSchemaToZod({...converted, suffix});
};
