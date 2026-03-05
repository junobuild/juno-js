import type {z} from 'zod';
import {jsonToSputnikSchema} from './_converters';
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
    case 'principal':
      return 'principal';
  }
};

export const zodToCandid = (inputs: Record<string, z.ZodType>): string =>
  jsonToSputnikSchema({inputs})
    .map(
      ({schema, id, isTopLevelOptional}) =>
        `type ${id} = ${isTopLevelOptional ? `opt ${sputnikSchemaToDid(schema)}` : sputnikSchemaToDid(schema)};`
    )
    .join('\n');
