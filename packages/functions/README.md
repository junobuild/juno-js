[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/functions
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/functions
[npm-license]: https://img.shields.io/npm/l/@junobuild/functions
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno Config

JavaScript and TypeScript utilities for [Juno] Serverless Functions.

<!-- TSDOC_START -->

### :toolbox: Functions

- [defineAssert](#gear-defineassert)
- [defineAssert](#gear-defineassert)
- [defineAssert](#gear-defineassert)
- [defineAssert](#gear-defineassert)
- [defineHook](#gear-definehook)
- [defineHook](#gear-definehook)
- [defineHook](#gear-definehook)
- [defineHook](#gear-definehook)
- [decodeDocData](#gear-decodedocdata)
- [encodeDocData](#gear-encodedocdata)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends AssertConfig>(config: T): T; <T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>; <T extends AssertConfig>(config: AssertFnOrObject<T>): AssertFnOrObject<...>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L31)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends AssertConfig>(config: T): T; <T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>; <T extends AssertConfig>(config: AssertFnOrObject<T>): AssertFnOrObject<...>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L32)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends AssertConfig>(config: T): T; <T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>; <T extends AssertConfig>(config: AssertFnOrObject<T>): AssertFnOrObject<...>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L33)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends AssertConfig>(config: T): T; <T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>; <T extends AssertConfig>(config: AssertFnOrObject<T>): AssertFnOrObject<...>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L36)

#### :gear: defineHook

| Function     | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends HookConfig>(config: T): T; <T extends HookConfig>(config: HookFn<T>): HookFn<T>; <T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L31)

#### :gear: defineHook

| Function     | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends HookConfig>(config: T): T; <T extends HookConfig>(config: HookFn<T>): HookFn<T>; <T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L32)

#### :gear: defineHook

| Function     | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends HookConfig>(config: T): T; <T extends HookConfig>(config: HookFn<T>): HookFn<T>; <T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L33)

#### :gear: defineHook

| Function     | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends HookConfig>(config: T): T; <T extends HookConfig>(config: HookFn<T>): HookFn<T>; <T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L34)

#### :gear: decodeDocData

| Function        | Type                      |
| --------------- | ------------------------- |
| `decodeDocData` | `<T>(data: RawData) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/datastore.sdk.ts#L4)

#### :gear: encodeDocData

| Function        | Type                      |
| --------------- | ------------------------- |
| `encodeDocData` | `<T>(data: T) => RawData` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/datastore.sdk.ts#L7)

### :tropical_drink: Interfaces

- [CollectionsConfig](#gear-collectionsconfig)
- [DocUpsert](#gear-docupsert)
- [DocAssertSet](#gear-docassertset)
- [Doc](#gear-doc)
- [SetDoc](#gear-setdoc)
- [HookContext](#gear-hookcontext)
- [DocContext](#gear-doccontext)
- [OnAssertConfig](#gear-onassertconfig)
- [OnHookConfig](#gear-onhookconfig)

#### :gear: CollectionsConfig

Defines the collections where a hook or assertion should run.

| Property      | Type                    | Description                                                                                    |
| ------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `collections` | `[string, ...string[]]` | An array containing at least one collection name where the hook or assertion will be executed. |

#### :gear: DocUpsert

Represents a document update operation.

This is used in hooks where a document is either being created or updated.

| Property | Type               | Description                                                                                  |
| -------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `before` | `Doc or undefined` | The previous version of the document before the update. Undefined if this is a new document. |
| `after`  | `Doc`              | The new version of the document after the update.                                            |

#### :gear: DocAssertSet

Represents a validation check before setting a document.

The developer can compare the `current` and `proposed` versions and
throw an error if their validation fails.

| Property   | Type               | Description                                                                                    |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `current`  | `Doc or undefined` | The current version of the document before the operation. Undefined if this is a new document. |
| `proposed` | `SetDoc`           | The proposed version of the document. This can be validated before allowing the operation.     |

#### :gear: Doc

Represents a document stored in a collection.

| Property      | Type                  | Description                                                                                                             |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `owner`       | `RawPrincipal`        | The user who owns this document.                                                                                        |
| `data`        | `RawData`             | The raw data of the document.                                                                                           |
| `description` | `string or undefined` | An optional description of the document.                                                                                |
| `created_at`  | `bigint`              | The timestamp when the document was first created.                                                                      |
| `updated_at`  | `bigint`              | The timestamp when the document was last updated.                                                                       |
| `version`     | `bigint or undefined` | The version number of the document, used for consistency checks. If not provided, it's assumed to be the first version. |

#### :gear: SetDoc

Represents a request to set or update a document.

This is used when submitting new document data.

| Property      | Type                  | Description                                                                                                                   |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `data`        | `RawData`             | The raw data of the document.                                                                                                 |
| `description` | `string or undefined` | An optional description of the document.                                                                                      |
| `version`     | `bigint or undefined` | The expected version number to ensure consistency. If provided, the operation will fail if the stored version does not match. |

#### :gear: HookContext

Represents the context provided to hooks, containing information about the caller and related data.

| Property | Type           | Description                                                                     |
| -------- | -------------- | ------------------------------------------------------------------------------- |
| `caller` | `RawPrincipal` | The user who originally triggered the function that in turn triggered the hook. |
| `data`   | `T`            | The data associated with the hook execution.                                    |

#### :gear: DocContext

Represents the context of a document operation within a collection.

| Property     | Type     | Description                                                    |
| ------------ | -------- | -------------------------------------------------------------- |
| `collection` | `string` | The name of the collection where the document is stored.       |
| `key`        | `string` | The unique key identifying the document within the collection. |
| `data`       | `T`      | The data associated with the document operation.               |

#### :gear: OnAssertConfig

A generic configuration interface for defining assertions related to collections.

| Property | Type                            | Description                                                                                                                                                                                              |
| -------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assert` | `(context: T) => Promise<void>` | A function that runs when the assertion is triggered for the specified collections. param: context - Contains information about the affected document(s).returns: Resolves when the operation completes. |

#### :gear: OnHookConfig

A generic configuration interface for defining hooks related to collections.

| Property | Type                            | Description                                                                                                                                                                                         |
| -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `run`    | `(context: T) => Promise<void>` | A function that runs when the hook is triggered for the specified collections. param: context - Contains information about the affected document(s).returns: Resolves when the operation completes. |

### :cocktail: Types

- [SatelliteConfigEnv](#gear-satelliteconfigenv)
- [Timestamp](#gear-timestamp)
- [Version](#gear-version)
- [RawData](#gear-rawdata)
- [RawPrincipal](#gear-rawprincipal)
- [RawUserId](#gear-rawuserid)
- [OnSetDocContext](#gear-onsetdoccontext)
- [AssertSetDocContext](#gear-assertsetdoccontext)
- [AssertSetDocConfig](#gear-assertsetdocconfig)
- [AssertConfig](#gear-assertconfig)
- [AssertFn](#gear-assertfn)
- [AssertFnOrObject](#gear-assertfnorobject)
- [OnSetDocConfig](#gear-onsetdocconfig)
- [HookConfig](#gear-hookconfig)
- [HookFn](#gear-hookfn)
- [HookFnOrObject](#gear-hookfnorobject)

#### :gear: SatelliteConfigEnv

Placeholder for future environment-specific configurations.

Currently unused, but it may support features such as:

- Defining the execution mode (e.g., staging or production).
- Providing environment-specific values like `ckBtcLedgerId` for test or production.

| Type                 | Type |
| -------------------- | ---- |
| `SatelliteConfigEnv` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/satellite.config.ts#L8)

#### :gear: Timestamp

Represents a timestamp in nanoseconds since the Unix epoch.

Used for tracking when events occur, such as document creation and updates.

| Type        | Type |
| ----------- | ---- |
| `Timestamp` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L6)

#### :gear: Version

Represents a version number for tracking changes.

This is typically incremented with each update to ensure consistency.

| Type      | Type |
| --------- | ---- |
| `Version` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L13)

#### :gear: RawData

Represents raw binary data.

This is used to store unstructured data in a document.

| Type      | Type         |
| --------- | ------------ |
| `RawData` | `Uint8Array` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L20)

#### :gear: RawPrincipal

Represents a raw principal identifier.

Principals are unique identities used in authentication and authorization.

| Type           | Type         |
| -------------- | ------------ |
| `RawPrincipal` | `Uint8Array` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L27)

#### :gear: RawUserId

Represents a raw user identifier.

This is a principal associated with a user.

| Type        | Type           |
| ----------- | -------------- |
| `RawUserId` | `RawPrincipal` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L34)

#### :gear: OnSetDocContext

The context provided to the `onSetDoc` hook.

This context contains information about the document being created or updated,
along with details about the user who triggered the operation.

| Type              | Type                                 |
| ----------------- | ------------------------------------ |
| `OnSetDocContext` | `HookContext<DocContext<DocUpsert>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L49)

#### :gear: AssertSetDocContext

The context provided to the `assertSetDoc` hook.

This context contains information about the document being validated before
it is created or updated. If validation fails, the developer should throw an error.

| Type                  | Type                                    |
| --------------------- | --------------------------------------- |
| `AssertSetDocContext` | `HookContext<DocContext<DocAssertSet>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L57)

#### :gear: AssertSetDocConfig

Configuration for an assertion that runs when a document is created or updated.

| Type                 | Type                                  |
| -------------------- | ------------------------------------- |
| `AssertSetDocConfig` | `OnAssertConfig<AssertSetDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L23)

#### :gear: AssertConfig

| Type           | Type                 |
| -------------- | -------------------- |
| `AssertConfig` | `AssertSetDocConfig` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L25)

#### :gear: AssertFn

| Type       | Type                                |
| ---------- | ----------------------------------- |
| `AssertFn` | `(config: SatelliteConfigEnv) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L27)

#### :gear: AssertFnOrObject

| Type               | Type               |
| ------------------ | ------------------ |
| `AssertFnOrObject` | `T or AssertFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L29)

#### :gear: OnSetDocConfig

Configuration for a hook that runs when a document is created or updated.

| Type             | Type                            |
| ---------------- | ------------------------------- |
| `OnSetDocConfig` | `OnHookConfig<OnSetDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L23)

#### :gear: HookConfig

| Type         | Type             |
| ------------ | ---------------- |
| `HookConfig` | `OnSetDocConfig` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L25)

#### :gear: HookFn

| Type     | Type                                |
| -------- | ----------------------------------- |
| `HookFn` | `(config: SatelliteConfigEnv) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L27)

#### :gear: HookFnOrObject

| Type             | Type             |
| ---------------- | ---------------- |
| `HookFnOrObject` | `T or HookFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L29)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
