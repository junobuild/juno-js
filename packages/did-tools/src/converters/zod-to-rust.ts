import type {z} from 'zod';
import type {ConvertedSputnikSchema} from './_converters';
import {jsonToSputnikSchema} from './_converters';
import type {SputnikSchema} from './_types';

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const DERIVES = '#[derive(CandidType, Serialize, Deserialize)]';

interface RustTypeResult {
  fieldType: string;
  extraStructs?: string[];
}

const schemaToRustType = ({
  schema,
  structName
}: {
  schema: SputnikSchema;
  structName: string;
}): RustTypeResult => {
  switch (schema.kind) {
    case 'text':
      return {fieldType: 'String'};
    case 'bool':
      return {fieldType: 'bool'};
    case 'float64':
      return {fieldType: 'f64'};
    case 'int32':
      return {fieldType: 'i32'};
    case 'nat':
      return {fieldType: 'u64'};
    case 'principal':
      return {fieldType: 'candid::Principal'};

    case 'opt': {
      const {fieldType, extraStructs} = schemaToRustType({schema: schema.inner, structName});
      return {fieldType: `Option<${fieldType}>`, extraStructs};
    }

    case 'vec': {
      const {fieldType, extraStructs} = schemaToRustType({schema: schema.inner, structName});
      return {fieldType: `Vec<${fieldType}>`, extraStructs};
    }

    case 'tuple':
    case 'indexedTuple': {
      const results = schema.members.map((m, i) =>
        schemaToRustType({schema: m, structName: `${structName}${i}`})
      );
      return {
        fieldType: `(${results.map((r) => r.fieldType).join(', ')})`,
        extraStructs: results.flatMap((r) => r.extraStructs ?? [])
      };
    }

    case 'variant': {
      const enumName = capitalize(structName);
      const variants = schema.tags.map((tag) => `    ${capitalize(tag)},`).join('\n');
      return {
        fieldType: enumName,
        extraStructs: [`${DERIVES}\npub enum ${enumName} {\n${variants}\n}`]
      };
    }

    case 'variantRecords': {
      const enumName = capitalize(structName);
      const results = schema.members.map((m, i) => {
        if (m.kind === 'record') {
          const fieldResults = m.fields.map((f) =>
            schemaToRustType({schema: f.type, structName: `${structName}${capitalize(f.name)}`})
          );
          const fields = m.fields
            .map((f, fi) => `        ${f.name}: ${fieldResults[fi].fieldType},`)
            .join('\n');
          return {
            variantLine: `    Variant${i} {\n${fields}\n    }`,
            extraStructs: fieldResults.flatMap((r) => r.extraStructs ?? [])
          };
        }
        const inner = schemaToRustType({schema: m, structName: `${structName}Variant${i}`});
        return {
          variantLine: `    Variant${i}(${inner.fieldType})`,
          extraStructs: inner.extraStructs ?? []
        };
      });
      const variants = results.map((r) => r.variantLine).join(',\n');
      return {
        fieldType: enumName,
        extraStructs: [
          ...results.flatMap((r) => r.extraStructs ?? []),
          `${DERIVES}\npub enum ${enumName} {\n${variants}\n}`
        ]
      };
    }

    case 'record': {
      const recordName = capitalize(structName);
      const fieldResults = schema.fields.map((f) =>
        schemaToRustType({schema: f.type, structName: `${structName}${capitalize(f.name)}`})
      );
      const fields = schema.fields
        .map((f, i) => `    pub ${f.name}: ${fieldResults[i].fieldType},`)
        .join('\n');
      return {
        fieldType: recordName,
        extraStructs: [
          ...fieldResults.flatMap((r) => r.extraStructs ?? []),
          `${DERIVES}\npub struct ${recordName} {\n${fields}\n}`
        ]
      };
    }
  }
};

export const sputnikSchemaToRust = ({
  id,
  schema,
  isTopLevelOptional
}: ConvertedSputnikSchema): string => {
  const baseName = `${capitalize(id)}Args`;
  const resolvedSchema: SputnikSchema = isTopLevelOptional ? {kind: 'opt', inner: schema} : schema;
  const {fieldType, extraStructs} = schemaToRustType({
    schema: resolvedSchema,
    structName: baseName
  });

  if (extraStructs !== undefined && extraStructs.length > 0) {
    // Record appends itself last
    return extraStructs.join('\n\n');
  }

  return `pub type ${baseName} = ${fieldType};`;
};

export const zodToRust = (inputs: Record<string, z.ZodType>): string =>
  jsonToSputnikSchema({inputs}).map(sputnikSchemaToRust).join('\n\n');
