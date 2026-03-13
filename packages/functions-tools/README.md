[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/functions-tools
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/functions-tools
[npm-license]: https://img.shields.io/npm/l/@junobuild/functions-tools
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno DID tools

Tools for generating [Juno] serverless functions code.

<!-- TSDOC_START -->

### :toolbox: Functions

- [zodToIdl](#gear-zodtoidl)
- [zodToRust](#gear-zodtorust)
- [zodToCandid](#gear-zodtocandid)

#### :gear: zodToIdl

Converts a Zod schema to a Candid IDL type for use with `IDL.encode` and `IDL.decode`.

| Function   | Type                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `zodToIdl` | `({ id, schema, suffix }: { id: string; schema: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>; suffix: "Args" or "Result"; }) => IdlResult` |

Parameters:

- `id`: - The base name used to generate the IDL type name.
- `schema`: - The Zod schema to convert.
- `suffix`: - Whether this represents function arguments or a return type.

Returns:

An object containing the generated IDL type and the base type name.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions-tools/src/converters/zod-to-idl.ts#L71)

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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions-tools/src/converters/zod-to-rust.ts#L204)

#### :gear: zodToCandid

Converts a Zod schema to a Candid type definition string.

| Function      | Type                                                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zodToCandid` | `({ id, schema, suffix }: { id: string; schema: ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>>; suffix: "Args" or "Result"; }) => CandidResult` |

Parameters:

- `id`: - The base name used to generate the type name.
- `schema`: - The Zod schema to convert.
- `suffix`: - Whether this represents function arguments or a return type.

Returns:

An object containing the generated Candid type declaration and the base type name.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions-tools/src/converters/zod-to-candid.ts#L70)

### :tropical_drink: Interfaces

- [IdlResult](#gear-idlresult)
- [RustResult](#gear-rustresult)
- [CandidResult](#gear-candidresult)

#### :gear: IdlResult

| Property   | Type       | Description |
| ---------- | ---------- | ----------- |
| `baseName` | `string`   |             |
| `idl`      | `IDL.Type` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions-tools/src/converters/zod-to-idl.ts#L43)

#### :gear: RustResult

| Property   | Type     | Description |
| ---------- | -------- | ----------- |
| `baseName` | `string` |             |
| `code`     | `string` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions-tools/src/converters/zod-to-rust.ts#L173)

#### :gear: CandidResult

| Property   | Type     | Description |
| ---------- | -------- | ----------- |
| `baseName` | `string` |             |
| `code`     | `string` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions-tools/src/converters/zod-to-candid.ts#L42)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
