import type {core} from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JSONSchemaOutput = core.ZodStandardJSONSchemaPayload<any>;
export type JSONSchema = core.JSONSchema.BaseSchema;

// Did -> in Rust
export type SputnikSchema =
  | {kind: 'text'} // -> String
  | {kind: 'bool'} // -> bool
  | {kind: 'float64'} // -> f64
  | {kind: 'int32'} // -> i32
  | {kind: 'bigint'} // -> u64
  | {kind: 'nat'} // -> u128
  | {kind: 'opt'; inner: SputnikSchema} // -> Option<T>
  | {kind: 'vec'; inner: SputnikSchema} // -> Vec<T>
  | {kind: 'record'; fields: {name: string; type: SputnikSchema}[]} // -> struct { field: T, ... }
  | {kind: 'tuple'; members: SputnikSchema[]} // -> (T, T, ...)
  | {kind: 'indexedTuple'; members: SputnikSchema[]} // -> (T, T, ...)
  | {kind: 'variant'; tags: string[]} // -> enum { A, B, C }
  | {kind: 'discriminatedUnion'; discriminator: string; members: SputnikSchema[]} // -> #[serde(tag = "...")] enum { VariantA { ... }, VariantB { ... } }
  | {kind: 'principal'}
  | {kind: 'uint8array'};
