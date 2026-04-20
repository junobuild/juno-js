[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/schema
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/schema
[npm-license]: https://img.shields.io/npm/l/@junobuild/schema
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno JavaScript Internet Computer Client

The `j` type system, all schemas and utilities for validation on [Juno].

```typescript
import {defineQuery} from '@junobuild/functions';
import {j} from '@junobuild/schema';

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

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
