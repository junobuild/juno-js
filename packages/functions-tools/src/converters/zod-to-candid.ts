import {capitalize} from '@junobuild/utils';
import type {z} from 'zod';
import {jsonToSputnikSchema, type SputnikSchemaResult} from './_converters';
import type {SputnikSchema} from './_types';

const sputnikSchemaToDid = (schema: SputnikSchema): string => {
  switch (schema.kind) {
    case 'text':
      return 'text';
    case 'bool':
      return 'bool';
    case 'float64':
      return 'float64';
    case 'int32':
      return 'int32';
    case 'nat':
      return 'nat';
    case 'principal':
      return 'principal';
    case 'uint8array':
      return 'blob';
    case 'opt':
      return `opt ${sputnikSchemaToDid(schema.inner)}`;
    case 'vec':
      return `vec ${sputnikSchemaToDid(schema.inner)}`;
    case 'record':
      if (schema.fields.length === 0) {
        return 'record {}';
      }
      return `record { ${schema.fields.map((f) => `${f.name} : ${sputnikSchemaToDid(f.type)}`).join('; ')} }`;
    case 'tuple':
      return `record { ${schema.members.map(sputnikSchemaToDid).join('; ')} }`;
    case 'indexedTuple':
      return `record { ${schema.members.map((m, i) => `${i} : ${sputnikSchemaToDid(m)}`).join('; ')} }`;
    case 'variant':
      return `variant { ${schema.tags.join('; ')} }`;
    case 'variantRecords':
      return `variant { ${schema.members.map(sputnikSchemaToDid).join('; ')} }`;
  }
};

export interface CandidResult {
  baseName: string;
  code: string;
}

const sputnikSchemaToCandid = ({
  id,
  schema,
  isTopLevelOptional,
  suffix
}: SputnikSchemaResult & {suffix: 'Args' | 'Result'}): CandidResult => {
  const baseName = `${capitalize(id)}${suffix}`;
  const resolvedSchema: SputnikSchema = isTopLevelOptional ? {kind: 'opt', inner: schema} : schema;

  return {
    baseName,
    code: `type ${baseName} = ${sputnikSchemaToDid(resolvedSchema)};`
  };
};

/**
 * Converts a Zod schema to a Candid type definition string.
 *
 * @param {string} id - The base name used to generate the type name.
 * @param {z.ZodType} schema - The Zod schema to convert.
 * @param {'Args' | 'Result'} suffix - Whether this represents function arguments or a return type.
 * @returns {CandidResult} An object containing the generated Candid type declaration and the base type name.
 */
export const zodToCandid = ({
  id,
  schema,
  suffix
}: {
  id: string;
  schema: z.ZodType;
  suffix: 'Args' | 'Result';
}): CandidResult => {
  const converted = jsonToSputnikSchema({zodSchema: schema, id});
  return sputnikSchemaToCandid({...converted, suffix});
};
