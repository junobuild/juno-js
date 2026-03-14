[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/schema
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/schema
[npm-license]: https://img.shields.io/npm/l/@junobuild/schema
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno JavaScript Internet Computer Client

The `j` type system, all schemas and utilities for validation on [Juno].

```typescript
import {j, defineQuery} from '@junobuild/functions';

const ArgsSchema = j.strictObject({
  id: j.principal(),
  name: j.string()
});

export const myQuery = defineQuery({
  args: ArgsSchema,
  handler: ({id, name}) => {
    console.log(id.toText(), name);
  }
});
```

<!-- TSDOC_START -->

### :toolbox: Functions

- [JunoType.principal](#gear-junotype.principal)

#### :gear: JunoType.principal

Validates a Principal.

| Function             | Type                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------ |
| `JunoType.principal` | `() => ZodPipe<ZodCustom<Principal, Principal>, ZodTransform<Principal, Principal>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/schema/src/type-system/index.ts#L4)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
