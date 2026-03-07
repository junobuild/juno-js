import type {z} from 'zod';
import { type SputnikSchemaResult,jsonToSputnikSchema} from './_converters';
import type {SputnikSchema} from './_types';

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const DERIVES = '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]';

type RustTypeResult =
  | {kind: 'primitive'; fieldType: string}
  | {kind: 'composite'; fieldType: string; structs: string[]};

const primitive = (result: {fieldType: string}): RustTypeResult => ({
  kind: 'primitive',
  ...result
});

const composite = (result: {fieldType: string; structs: string[]}): RustTypeResult => ({
  kind: 'composite',
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
      return primitive({fieldType: 'candid::Principal'});

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
      const enumName = capitalize(structName);
      const variants = schema.tags.map((tag) => `    ${capitalize(tag)},`).join('\n');
      return composite({
        fieldType: enumName,
        structs: [`${DERIVES}\npub enum ${enumName} {\n${variants}\n}`]
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
            .map((f, fi) => `        ${f.name}: ${fieldResults[fi].fieldType},`)
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
        .map((f, i) => `    pub ${f.name}: ${fieldResults[i].fieldType},`)
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
