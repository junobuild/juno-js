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

- [recursiveToNullable](#gear-recursivetonullable)
- [recursiveFromNullable](#gear-recursivefromnullable)

#### :gear: recursiveToNullable

Recursively converts a JavaScript value to its Candid nullable representation,
guided by a Zod schema.

Optional and nullable fields are converted from `undefined` or `null` to `[]`,
and present values are wrapped in `[value]`. Objects and arrays are processed
recursively. Non-nullable primitives and unknown types are passed through as-is.

| Function              | Type                                             |
| --------------------- | ------------------------------------------------ |
| `recursiveToNullable` | `({ schema, value }: NullableParams) => unknown` |

Parameters:

- `params`: - The schema and value to convert.
- `params.schema`: - The Zod schema describing the value's structure.
- `params.value`: - The JavaScript value to convert.

Returns:

The value in Candid nullable format.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/did.ts#L22)

#### :gear: recursiveFromNullable

Recursively converts a Candid nullable value back to its JavaScript representation,
guided by a Zod schema.

Optional and nullable fields are converted from `[]` to `undefined` and from
`[value]` to `value`. Objects and arrays are processed recursively. Non-nullable
primitives and unknown types are passed through as-is.

| Function                | Type                                             |
| ----------------------- | ------------------------------------------------ |
| `recursiveFromNullable` | `({ schema, value }: NullableParams) => unknown` |

Parameters:

- `params`: - The schema and value to convert.
- `params.schema`: - The Zod schema describing the value's structure.
- `params.value`: - The Candid nullable value to convert.

Returns:

The value in JavaScript representation.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/zod/src/did.ts#L64)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
