import {IDL} from '@icp-sdk/core/candid';
import {capitalize} from '@junobuild/utils';
import type {z} from 'zod';
import {jsonToSputnikSchema, type SputnikSchemaResult} from './_converters';
import type {SputnikSchema} from './_types';

const schemaToIdlType = (schema: SputnikSchema): IDL.Type => {
  switch (schema.kind) {
    case 'text':
      return IDL.Text;
    case 'bool':
      return IDL.Bool;
    case 'float64':
      return IDL.Float64;
    case 'int32':
      return IDL.Int32;
    case 'nat':
      return IDL.Nat64;
    case 'principal':
      return IDL.Principal;
    case 'uint8array':
      return IDL.Vec(IDL.Nat8);
    case 'opt':
      return IDL.Opt(schemaToIdlType(schema.inner));
    case 'vec':
      return IDL.Vec(schemaToIdlType(schema.inner));
    case 'tuple':
    case 'indexedTuple':
      return IDL.Tuple(...schema.members.map(schemaToIdlType));
    case 'record':
      return IDL.Record(
        Object.fromEntries(schema.fields.map((f) => [f.name, schemaToIdlType(f.type)]))
      );
    case 'variant':
      return IDL.Variant(Object.fromEntries(schema.tags.map((t) => [t, IDL.Null])));
    case 'variantRecords':
      return IDL.Variant(
        Object.fromEntries(schema.members.map((m, i) => [`Variant${i}`, schemaToIdlType(m)]))
      );
  }
};

export interface IdlResult {
  baseName: string;
  idl: IDL.Type;
}

const sputnikSchemaToIdl = ({
  id,
  schema,
  isTopLevelOptional,
  suffix
}: SputnikSchemaResult & {suffix: 'Args' | 'Result'}): IdlResult => {
  const resolvedSchema: SputnikSchema = isTopLevelOptional ? {kind: 'opt', inner: schema} : schema;
  const idl = schemaToIdlType(resolvedSchema);

  const baseName = `${capitalize(id)}${suffix}`;

  return {baseName, idl};
};

/**
 * Converts a Zod schema to a Candid IDL type for use with `IDL.encode` and `IDL.decode`.
 *
 * @param {string} id - The base name used to generate the IDL type name.
 * @param {z.ZodType} schema - The Zod schema to convert.
 * @param {'Args' | 'Result'} suffix - Whether this represents function arguments or a return type.
 * @returns {IdlResult} An object containing the generated IDL type and the base type name.
 *
 */
export const zodToIdl = ({
  id,
  schema,
  suffix
}: {
  id: string;
  schema: z.ZodType;
  suffix: 'Args' | 'Result';
}): IdlResult => {
  const converted = jsonToSputnikSchema({zodSchema: schema, id});
  return sputnikSchemaToIdl({...converted, suffix});
};
