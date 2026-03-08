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

- [zodToCandid](#gear-zodtocandid)
- [zodToRust](#gear-zodtorust)

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

- [RustResult](#gear-rustresult)

#### :gear: RustResult

| Property   | Type     | Description |
| ---------- | -------- | ----------- |
| `baseName` | `string` |             |
| `code`     | `string` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/zod-to-rust.ts#L136)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
