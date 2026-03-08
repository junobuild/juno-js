[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/zod
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/zod
[npm-license]: https://img.shields.io/npm/l/@junobuild/zod
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Zod for Juno

Zod utilities and converters for [Juno].

<!-- TSDOC_START -->

### :toolbox: Functions

- [jsonToSputnikSchema](#gear-jsontosputnikschema)
- [zodToCandid](#gear-zodtocandid)
- [capitalize](#gear-capitalize)
- [zodToRust](#gear-zodtorust)

#### :gear: jsonToSputnikSchema

| Function              | Type                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `jsonToSputnikSchema` | `({ id, zodSchema }: { id: string; zodSchema: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>; }) => SputnikSchemaResult` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/_converters.ts#L11)

#### :gear: zodToCandid

Converts a record of Zod schemas to a Candid type definition string.

| Function      | Type                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `zodToCandid` | `(inputs: Record<string, ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>>) => string` |

Parameters:

- `inputs`: - A record mapping type names to Zod schemas.

Returns:

A Candid type definition string, one `type` declaration per entry.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/zod-to-candid.ts#L46)

#### :gear: capitalize

| Function     | Type                      |
| ------------ | ------------------------- |
| `capitalize` | `(str: string) => string` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/_string.utils.ts#L1)

#### :gear: zodToRust

Converts a Zod schema to a Rust type definition string.

| Function    | Type                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zodToRust` | `({ id, schema, suffix }: { id: string; schema: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>; suffix: "Args" or "Result"; }) => RustResult` |

Parameters:

- `id`: - The base name used to generate the Rust struct or type alias name.
- `schema`: - The Zod schema to convert.
- `suffix`: - Whether this represents function arguments or a return type.

Returns:

An object containing the generated Rust code and the base type name.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/zod-to-rust.ts#L167)

### :tropical_drink: Interfaces

- [SputnikSchemaResult](#gear-sputnikschemaresult)
- [RustResult](#gear-rustresult)

#### :gear: SputnikSchemaResult

| Property             | Type            | Description |
| -------------------- | --------------- | ----------- |
| `id`                 | `string`        |             |
| `schema`             | `SputnikSchema` |             |
| `isTopLevelOptional` | `boolean`       |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/_converters.ts#L5)

#### :gear: RustResult

| Property   | Type     | Description |
| ---------- | -------- | ----------- |
| `baseName` | `string` |             |
| `code`     | `string` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/zod-to-rust.ts#L136)

### :cocktail: Types

- [JSONSchemaOutput](#gear-jsonschemaoutput)
- [JSONSchema](#gear-jsonschema)
- [SputnikSchema](#gear-sputnikschema)

#### :gear: JSONSchemaOutput

| Type               | Type                                     |
| ------------------ | ---------------------------------------- |
| `JSONSchemaOutput` | `core.ZodStandardJSONSchemaPayload<any>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/_types.ts#L4)

#### :gear: JSONSchema

| Type         | Type                         |
| ------------ | ---------------------------- |
| `JSONSchema` | `core.JSONSchema.BaseSchema` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/_types.ts#L5)

#### :gear: SputnikSchema

| Type            | Type |
| --------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SputnikSchema` | `    | {kind: 'text'} // -> String or {kind: 'bool'} // -> bool or {kind: 'float64'} // -> f64 or {kind: 'int32'} // -> i32 or {kind: 'nat'} // -> u64 or {kind: 'opt'; inner: SputnikSchema} // -> Option<T> or {kind: 'vec'; inner: SputnikSchema} // -> Vec<T> or {kind: 'record'; fields: {name: string; type: SputnikSchema}[]} // -> struct { field: T, ... } or {kind: 'tuple'; members: SputnikSchema[]} // -> (T, T, ...) or {kind: 'indexedTuple'; members: SputnikSchema[]} // -> (T, T, ...) or {kind: 'variant'; tags: string[]} // -> enum { A, B, C } or {kind: 'variantRecords'; members: SputnikSchema[]} // -> enum { VariantA { ... }, VariantB { ... } } or {kind: 'principal'}` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/_types.ts#L8)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
