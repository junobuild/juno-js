import {capitalize} from '@junobuild/utils';
import type {z} from 'zod';
import {jsonToSputnikSchema, type SputnikSchemaResult} from './_converters';
import type {SputnikSchema} from './_types';

const schemaToString = (schema: SputnikSchema): string => {
  switch (schema.kind) {
    case 'text':
      return 'j.string()';
    case 'bool':
      return 'j.boolean()';
    case 'float64':
      return 'j.number()';
    case 'int32':
      return 'j.int()';
    case 'nat':
      return 'j.bigint()';
    case 'principal':
      return 'j.principal()';
    case 'uint8array':
      return 'j.uint8Array()';
    case 'opt':
      return `j.optional(${schemaToString(schema.inner)})`;
    case 'vec':
      return `j.array(${schemaToString(schema.inner)})`;
    case 'tuple':
    case 'indexedTuple':
      return `j.tuple([${schema.members.map(schemaToString).join(', ')}])`;
    case 'record':
      return `j.strictObject({${schema.fields.map((f) => `${f.name}: ${schemaToString(f.type)}`).join(', ')}})`;
    case 'variant':
      return `j.enum([${schema.tags.map((t) => `'${t}'`).join(', ')}])`;
    case 'discriminatedUnion':
      return `j.discriminatedUnion('${schema.discriminator}', [${schema.members.map(schemaToString).join(', ')}])`;
  }
};

export interface SchemaResult {
  baseName: string;
  code: string;
}

const sputnikSchemaToZod = ({
  id,
  schema,
  isTopLevelOptional,
  suffix
}: SputnikSchemaResult & {suffix: 'Args' | 'Result'}): SchemaResult => {
  const baseName = `${capitalize(id)}${suffix}`;
  const resolvedSchema: SputnikSchema = isTopLevelOptional ? {kind: 'opt', inner: schema} : schema;
  const zodString = schemaToString(resolvedSchema);

  return {
    baseName,
    code: `const ${baseName}Schema = ${zodString};`
  };
};

/**
 * Converts a Zod schema to Juno schema source code.
 *
 * @param {string} id - The base name used to generate the schema constant name.
 * @param {z.ZodType} schema - The Zod schema to convert.
 * @param {'Args' | 'Result'} suffix - Whether this represents function arguments or a return type.
 * @returns {SchemaResult} An object containing the generated code and the base type name.
 */
export const zodToSchema = ({
  id,
  schema,
  suffix
}: {
  id: string;
  schema: z.ZodType;
  suffix: 'Args' | 'Result';
}): SchemaResult => {
  const converted = jsonToSputnikSchema({zodSchema: schema, id});
  return sputnikSchemaToZod({...converted, suffix});
};
