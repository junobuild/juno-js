import {capitalize} from '@junobuild/utils';
import type {z} from 'zod';
import {type SputnikSchemaResult, jsonToSputnikSchema} from './_converters';
import type {SputnikSchema} from './_types';

const DERIVES = '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]';

// Simple string enums do not require JsonData — serde handles them natively
const DERIVES_SIMPLE_ENUM = '#[derive(CandidType, Serialize, Deserialize, Clone)]';

// Handle struct field not supported in Rust which would lead to issue such as "Field type is required"
// type => r#type
const RUST_KEYWORDS = new Set([
  'type',
  'struct',
  'enum',
  'fn',
  'let',
  'match',
  'use',
  'mod',
  'impl',
  'trait',
  'where',
  'move',
  'ref',
  'self',
  'super',
  'crate'
]);

const sanitizeFieldName = (name: string): {name: string; sanitized: boolean} =>
  RUST_KEYWORDS.has(name) ? {name: `r#${name}`, sanitized: true} : {name, sanitized: false};

type RustTypeResult =
  | {kind: 'primitive'; fieldType: string}
  | {kind: 'composite'; fieldType: string; structs: string[]; needsJsonData: boolean};

const primitive = (result: {fieldType: string}): RustTypeResult => ({
  kind: 'primitive',
  ...result
});

const composite = (result: {
  fieldType: string;
  structs: string[];
  needsJsonData?: boolean;
}): RustTypeResult => ({
  kind: 'composite',
  needsJsonData: true,
  ...result
});

const collectStructs = (results: RustTypeResult[]): string[] =>
  results.flatMap((r) => (r.kind === 'composite' ? r.structs : []));

const schemaToRustType = ({
  schema,
  structName
}: {
  schema: SputnikSchema;
  structName: string;
}): RustTypeResult => {
  switch (schema.kind) {
    case 'text':
      return primitive({fieldType: 'String'});

    case 'bool':
      return primitive({fieldType: 'bool'});

    case 'float64':
      return primitive({fieldType: 'f64'});

    case 'int32':
      return primitive({fieldType: 'i32'});

    case 'nat':
      return primitive({fieldType: 'u64'});

    case 'principal':
      return primitive({fieldType: 'Principal'});

    case 'uint8array':
      return primitive({fieldType: 'Vec<u8>'});

    case 'opt': {
      const inner = schemaToRustType({schema: schema.inner, structName});
      const fieldType = `Option<${inner.fieldType}>`;
      return inner.kind === 'composite'
        ? composite({fieldType, structs: inner.structs})
        : primitive({fieldType});
    }

    case 'vec': {
      const inner = schemaToRustType({schema: schema.inner, structName});
      const fieldType = `Vec<${inner.fieldType}>`;
      return inner.kind === 'composite'
        ? composite({fieldType, structs: inner.structs})
        : primitive({fieldType});
    }

    case 'tuple':
    case 'indexedTuple': {
      const results = schema.members.map((m, i) =>
        schemaToRustType({schema: m, structName: `${structName}${i}`})
      );
      const fieldType = `(${results.map((r) => r.fieldType).join(', ')})`;
      const structs = collectStructs(results);
      return structs.length > 0 ? composite({fieldType, structs}) : primitive({fieldType});
    }

    case 'variant': {
      if (schema.tags.length === 1) {
        return primitive({fieldType: 'String'});
      }

      const enumName = capitalize(structName);
      const variants = schema.tags.map((tag) => `    ${capitalize(tag)},`).join('\n');
      return composite({
        fieldType: enumName,
        structs: [`${DERIVES_SIMPLE_ENUM}\npub enum ${enumName} {\n${variants}\n}`],
        needsJsonData: false
      });
    }

    case 'discriminatedUnion': {
      const enumName = capitalize(structName);
      const results = schema.members.map((m, i) => {
        if (m.kind === 'record') {
          const nonDiscriminatorFields = m.fields.filter((f) => f.name !== schema.discriminator);
          const fieldResults = nonDiscriminatorFields.map((f) =>
            schemaToRustType({schema: f.type, structName: `${structName}${capitalize(f.name)}`})
          );

          const fields = nonDiscriminatorFields
            .map((f, fi) => {
              const {name: fieldName, sanitized} = sanitizeFieldName(f.name);
              const renameAttr = sanitized ? `        #[serde(rename = "${f.name}")]\n` : '';
              return `${renameAttr}        ${fieldName}: ${fieldResults[fi].fieldType},`;
            })
            .join('\n');

          const discriminatorField = m.fields.find((f) => f.name === schema.discriminator);
          const tagValue =
            discriminatorField?.type.kind === 'variant'
              ? discriminatorField.type.tags[0]
              : undefined;
          const renameVariant =
            tagValue !== undefined ? `    #[serde(rename = "${tagValue}")]\n` : '';

          return {
            variantLine:
              fields.length > 0
                ? `${renameVariant}    Variant${i} {\n${fields}\n    }`
                : `${renameVariant}    Variant${i}`,
            structs: collectStructs(fieldResults)
          };
        }
        const inner = schemaToRustType({schema: m, structName: `${structName}Variant${i}`});
        return {
          variantLine: `    Variant${i}(${inner.fieldType})`,
          structs: inner.kind === 'composite' ? inner.structs : []
        };
      });

      const variants = results.map((r) => r.variantLine).join(',\n');
      return composite({
        fieldType: enumName,
        structs: [
          ...results.flatMap((r) => r.structs),
          `${DERIVES}\n#[json_data(tag = "${schema.discriminator}")]\npub enum ${enumName} {\n${variants}\n}`
        ]
      });
    }

    case 'variantRecords': {
      const enumName = capitalize(structName);
      const results = schema.members.map((m, i) => {
        if (m.kind === 'record') {
          const fieldResults = m.fields.map((f) =>
            schemaToRustType({schema: f.type, structName: `${structName}${capitalize(f.name)}`})
          );

          const fields = m.fields
            .map((f, fi) => {
              const {name: fieldName, sanitized} = sanitizeFieldName(f.name);
              const renameAttr = sanitized ? `        #[serde(rename = "${f.name}")]\n` : '';
              return `${renameAttr}        ${fieldName}: ${fieldResults[fi].fieldType},`;
            })
            .join('\n');

          return {
            variantLine: `    Variant${i} {\n${fields}\n    }`,
            structs: collectStructs(fieldResults)
          };
        }
        const inner = schemaToRustType({schema: m, structName: `${structName}Variant${i}`});
        return {
          variantLine: `    Variant${i}(${inner.fieldType})`,
          structs: inner.kind === 'composite' ? inner.structs : []
        };
      });
      const variants = results.map((r) => r.variantLine).join(',\n');
      return composite({
        fieldType: enumName,
        structs: [
          ...results.flatMap((r) => r.structs),
          `${DERIVES}\npub enum ${enumName} {\n${variants}\n}`
        ]
      });
    }

    case 'record': {
      const recordName = capitalize(structName);
      const fieldResults = schema.fields.map((f) =>
        schemaToRustType({schema: f.type, structName: `${structName}${capitalize(f.name)}`})
      );

      const fields = schema.fields
        .map((f, i) => {
          const result = fieldResults[i];
          const {name: fieldName, sanitized} = sanitizeFieldName(f.name);
          const renameAttr = sanitized ? `    #[serde(rename = "${f.name}")]\n` : '';
          const attr =
            result.kind === 'composite' && result.needsJsonData ? '    #[json_data(nested)]\n' : '';
          return `${renameAttr}${attr}    pub ${fieldName}: ${result.fieldType},`;
        })
        .join('\n');

      return composite({
        fieldType: recordName,
        structs: [
          ...collectStructs(fieldResults),
          `${DERIVES}\npub struct ${recordName} {\n${fields}\n}`
        ]
      });
    }
  }
};

export interface RustResult {
  baseName: string;
  code: string;
}

const sputnikSchemaToRust = ({
  id,
  schema,
  isTopLevelOptional,
  suffix
}: SputnikSchemaResult & {suffix: 'Args' | 'Result'}): RustResult => {
  const baseName = `${capitalize(id)}${suffix}`;
  const resolvedSchema: SputnikSchema = isTopLevelOptional ? {kind: 'opt', inner: schema} : schema;
  const result = schemaToRustType({schema: resolvedSchema, structName: baseName});

  if (result.kind === 'composite') {
    return {baseName, code: result.structs.join('\n\n')};
  }

  return {baseName, code: `pub type ${baseName} = ${result.fieldType};`};
};

/**
 * Converts a Zod schema to a Rust type definition string.
 *
 * @param {string} id - The base name used to generate the Rust struct or type alias name.
 * @param {z.ZodType} schema - The Zod schema to convert.
 * @param {'Args' | 'Result'} suffix - Whether this represents function arguments or a return type.
 * @returns {RustResult} An object containing the generated Rust code and the base type name.
 *
 */
export const zodToRust = ({
  id,
  schema,
  suffix
}: {
  id: string;
  schema: z.ZodType;
  suffix: 'Args' | 'Result';
}): RustResult => {
  const converted = jsonToSputnikSchema({zodSchema: schema, id});
  return sputnikSchemaToRust({...converted, suffix});
};
