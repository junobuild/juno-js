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

- [DocContextSchema](#gear-doccontextschema)
- [AssertFnSchema](#gear-assertfnschema)
- [AssertFnOrObjectSchema](#gear-assertfnorobjectschema)
- [defineAssert](#gear-defineassert)
- [defineAssert](#gear-defineassert)
- [defineAssert](#gear-defineassert)
- [defineAssert](#gear-defineassert)
- [HookFnSchema](#gear-hookfnschema)
- [HookFnOrObjectSchema](#gear-hookfnorobjectschema)
- [defineHook](#gear-definehook)
- [defineHook](#gear-definehook)
- [defineHook](#gear-definehook)
- [defineHook](#gear-definehook)
- [decodeDocData](#gear-decodedocdata)
- [encodeDocData](#gear-encodedocdata)

#### :gear: DocContextSchema

| Function           | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocContextSchema` | `<T extends z.ZodTypeAny>(dataSchema: T) => ZodObject<{ collection: ZodString; key: ZodString; data: T; }, "strict", ZodTypeAny, { [k in keyof addQuestionMarks<baseObjectOutputType<{ collection: ZodString; key: ZodString; data: T; }>, any>]: addQuestionMarks<...>[k]; }, { [k in keyof baseObjectInputType<...>]: baseOb...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L33)

#### :gear: AssertFnSchema

| Function         | Type                                                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `AssertFnSchema` | `<T extends z.ZodTypeAny>(hookConfigSchema: T) => ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L43)

#### :gear: AssertFnOrObjectSchema

| Function                 | Type                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `AssertFnOrObjectSchema` | `<T extends z.ZodTypeAny>(hookConfigSchema: T) => ZodUnion<[T, ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L49)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends AssertConfig>(config: T): T; <T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>; <T extends AssertConfig>(config: AssertFnOrObject<T>): AssertFnOrObject<...>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L53)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends AssertConfig>(config: T): T; <T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>; <T extends AssertConfig>(config: AssertFnOrObject<T>): AssertFnOrObject<...>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L54)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends AssertConfig>(config: T): T; <T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>; <T extends AssertConfig>(config: AssertFnOrObject<T>): AssertFnOrObject<...>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L55)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends AssertConfig>(config: T): T; <T extends AssertConfig>(config: AssertFn<T>): AssertFn<T>; <T extends AssertConfig>(config: AssertFnOrObject<T>): AssertFnOrObject<...>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L58)

#### :gear: HookFnSchema

| Function       | Type                                                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `HookFnSchema` | `<T extends z.ZodTypeAny>(hookConfigSchema: T) => ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L43)

#### :gear: HookFnOrObjectSchema

| Function               | Type                                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `HookFnOrObjectSchema` | `<T extends z.ZodTypeAny>(hookConfigSchema: T) => ZodUnion<[T, ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L47)

#### :gear: defineHook

| Function     | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends HookConfig>(config: T): T; <T extends HookConfig>(config: HookFn<T>): HookFn<T>; <T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L51)

#### :gear: defineHook

| Function     | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends HookConfig>(config: T): T; <T extends HookConfig>(config: HookFn<T>): HookFn<T>; <T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L52)

#### :gear: defineHook

| Function     | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends HookConfig>(config: T): T; <T extends HookConfig>(config: HookFn<T>): HookFn<T>; <T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L53)

#### :gear: defineHook

| Function     | Type                                                                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends HookConfig>(config: T): T; <T extends HookConfig>(config: HookFn<T>): HookFn<T>; <T extends HookConfig>(config: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L54)

#### :gear: decodeDocData

| Function        | Type                                      |
| --------------- | ----------------------------------------- |
| `decodeDocData` | `<T>(data: Uint8Array<ArrayBuffer>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/datastore.sdk.ts#L4)

#### :gear: encodeDocData

| Function        | Type                                      |
| --------------- | ----------------------------------------- |
| `encodeDocData` | `<T>(data: T) => Uint8Array<ArrayBuffer>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/datastore.sdk.ts#L7)

### :wrench: Constants

- [TimestampSchema](#gear-timestampschema)
- [VersionSchema](#gear-versionschema)
- [RawDataSchema](#gear-rawdataschema)
- [RawPrincipalSchema](#gear-rawprincipalschema)
- [RawUserIdSchema](#gear-rawuseridschema)
- [DocDescriptionSchema](#gear-docdescriptionschema)
- [DocSchema](#gear-docschema)
- [DocUpsertSchema](#gear-docupsertschema)
- [ProposedDocSchema](#gear-proposeddocschema)
- [DocAssertSetSchema](#gear-docassertsetschema)
- [SetDocSchema](#gear-setdocschema)
- [OnSetDocContextSchema](#gear-onsetdoccontextschema)
- [AssertSetDocContextSchema](#gear-assertsetdoccontextschema)
- [CollectionsConfigSchema](#gear-collectionsconfigschema)
- [SatelliteConfigEnvSchema](#gear-satelliteconfigenvschema)
- [AssertSetDocConfigSchema](#gear-assertsetdocconfigschema)
- [AssertConfigSchema](#gear-assertconfigschema)
- [OnSetDocConfigSchema](#gear-onsetdocconfigschema)
- [HookConfigSchema](#gear-hookconfigschema)

#### :gear: TimestampSchema

| Constant          | Type        |
| ----------------- | ----------- |
| `TimestampSchema` | `ZodBigInt` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L6)

#### :gear: VersionSchema

| Constant        | Type        |
| --------------- | ----------- |
| `VersionSchema` | `ZodBigInt` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L18)

#### :gear: RawDataSchema

| Constant        | Type                                                                    |
| --------------- | ----------------------------------------------------------------------- |
| `RawDataSchema` | `ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L30)

#### :gear: RawPrincipalSchema

| Constant             | Type                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| `RawPrincipalSchema` | `ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L42)

#### :gear: RawUserIdSchema

| Constant          | Type                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| `RawUserIdSchema` | `ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L54)

#### :gear: DocDescriptionSchema

| Constant               | Type        |
| ---------------------- | ----------- |
| `DocDescriptionSchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L7)

#### :gear: DocSchema

| Constant    | Type                                                                                                                                                                                                                                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocSchema` | `ZodObject<{ owner: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>; data: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<...>>; description: ZodOptional<...>; created_at: ZodBigInt; updated_at: ZodBigInt; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L17)

#### :gear: DocUpsertSchema

| Constant          | Type                                                                                                                                                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocUpsertSchema` | `ZodObject<{ before: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>; data: ZodType<...>; description: ZodOptional<...>; created_at: ZodBigInt; updated_at: ZodBigInt; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; after: ZodObject<...>; }...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L60)

#### :gear: ProposedDocSchema

| Constant            | Type                                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProposedDocSchema` | `ZodObject<{ data: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>; description: ZodOptional<ZodString>; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L85)

#### :gear: DocAssertSetSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocAssertSetSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>; data: ZodType<...>; description: ZodOptional<...>; created_at: ZodBigInt; updated_at: ZodBigInt; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; proposed: ZodObject<......` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L113)

#### :gear: SetDocSchema

| Constant       | Type                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocSchema` | `ZodObject<{ data: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>; description: ZodOptional<ZodString>; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L140)

#### :gear: OnSetDocContextSchema

| Constant                | Type                                                                                                                                                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>; data: ZodObject<{ collection: ZodString; key: ZodString; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L63)

#### :gear: AssertSetDocContextSchema

| Constant                    | Type                                                                                                                                                                                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<ArrayBuffer>>; data: ZodObject<{ collection: ZodString; key: ZodString; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L76)

#### :gear: CollectionsConfigSchema

Defines the collections where a hook or assertion should run.

| Constant                  | Type                                                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `CollectionsConfigSchema` | `ZodObject<{ collections: ZodArray<ZodString, "many">; }, "strict", ZodTypeAny, { collections: string[]; }, { collections: string[]; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/collections.config.ts#L6)

#### :gear: SatelliteConfigEnvSchema

Placeholder for future environment-specific configurations.

Currently unused, but it may support features such as:

- Defining the execution mode (e.g., staging or production).
- Providing environment-specific values like `ckBtcLedgerId` for test or production.

| Constant                   | Type                               |
| -------------------------- | ---------------------------------- |
| `SatelliteConfigEnvSchema` | `ZodRecord<ZodString, ZodUnknown>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/satellite.config.ts#L10)

#### :gear: AssertSetDocConfigSchema

| Constant                   | Type                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocConfigSchema` | `ZodObject<extendShape<{ collections: ZodArray<ZodString, "many">; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>], ZodUnknown>, ZodPromise<...>>; }>, "strict", ZodTypeAny, { ...; ...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L25)

#### :gear: AssertConfigSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertConfigSchema` | `ZodObject<extendShape<{ collections: ZodArray<ZodString, "many">; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>], ZodUnknown>, ZodPromise<...>>; }>, "strict", ZodTypeAny, { ...; ...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L36)

#### :gear: OnSetDocConfigSchema

| Constant               | Type                                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocConfigSchema` | `ZodObject<extendShape<{ collections: ZodArray<ZodString, "many">; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>], ZodUnknown>, ZodPromise<...>>; }>, "strict", ZodTypeAny, { ...; }, ...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L25)

#### :gear: HookConfigSchema

| Constant           | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookConfigSchema` | `ZodObject<extendShape<{ collections: ZodArray<ZodString, "many">; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBuffer>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>], ZodUnknown>, ZodPromise<...>>; }>, "strict", ZodTypeAny, { ...; }, ...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L36)

### :cocktail: Types

- [Timestamp](#gear-timestamp)
- [Version](#gear-version)
- [RawData](#gear-rawdata)
- [RawPrincipal](#gear-rawprincipal)
- [RawUserId](#gear-rawuserid)
- [DocDescription](#gear-docdescription)
- [Doc](#gear-doc)
- [DocUpsert](#gear-docupsert)
- [ProposedDoc](#gear-proposeddoc)
- [DocAssertSet](#gear-docassertset)
- [SetDoc](#gear-setdoc)
- [HookContext](#gear-hookcontext)
- [DocContext](#gear-doccontext)
- [OnSetDocContext](#gear-onsetdoccontext)
- [AssertSetDocContext](#gear-assertsetdoccontext)
- [CollectionsConfig](#gear-collectionsconfig)
- [SatelliteConfigEnv](#gear-satelliteconfigenv)
- [AssertSetDocConfig](#gear-assertsetdocconfig)
- [AssertConfig](#gear-assertconfig)
- [AssertFn](#gear-assertfn)
- [AssertFnOrObject](#gear-assertfnorobject)
- [OnSetDocConfig](#gear-onsetdocconfig)
- [HookConfig](#gear-hookconfig)
- [HookFn](#gear-hookfn)
- [HookFnOrObject](#gear-hookfnorobject)

#### :gear: Timestamp

Represents a timestamp in nanoseconds since the Unix epoch.

Used for tracking when events occur, such as document creation and updates.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `Timestamp` | `z.infer<typeof TimestampSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L13)

#### :gear: Version

Represents a version number for tracking changes.

This is typically incremented with each update to ensure consistency.

| Type      | Type                            |
| --------- | ------------------------------- |
| `Version` | `z.infer<typeof VersionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L25)

#### :gear: RawData

Represents raw binary data.

This is used to store unstructured data in a document.

| Type      | Type                            |
| --------- | ------------------------------- |
| `RawData` | `z.infer<typeof RawDataSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L37)

#### :gear: RawPrincipal

Represents a raw principal identifier.

Principals are unique identities used in authentication and authorization.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `RawPrincipal` | `z.infer<typeof RawPrincipalSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L49)

#### :gear: RawUserId

Represents a raw user identifier.

This is a principal associated with a user.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `RawUserId` | `z.infer<typeof RawUserIdSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/core.ts#L61)

#### :gear: DocDescription

Represents a document description with a maximum length of 1024 characters.

| Type             | Type                                   |
| ---------------- | -------------------------------------- |
| `DocDescription` | `z.infer<typeof DocDescriptionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L12)

#### :gear: Doc

Represents a document stored in a collection.

| Type  | Type                        |
| ----- | --------------------------- |
| `Doc` | `z.infer<typeof DocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L55)

#### :gear: DocUpsert

Represents a document update operation.

This is used in hooks where a document is either being created or updated.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `DocUpsert` | `z.infer<typeof DocUpsertSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L80)

#### :gear: ProposedDoc

Represents the proposed version of a document.
This can be validated before allowing the operation.

| Type          | Type                                |
| ------------- | ----------------------------------- |
| `ProposedDoc` | `z.infer<typeof ProposedDocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L108)

#### :gear: DocAssertSet

Represents a validation check before setting a document.

The developer can compare the `current` and `proposed` versions and
throw an error if their validation fails.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `DocAssertSet` | `z.infer<typeof DocAssertSetSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L135)

#### :gear: SetDoc

Represents a request to set or update a document.

This is used when submitting new document data.

| Type     | Type                           |
| -------- | ------------------------------ |
| `SetDoc` | `z.infer<typeof SetDocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/datastore.ts#L165)

#### :gear: HookContext

Represents the context provided to hooks, containing information about the caller and related data.

| Type          | Type                                               |
| ------------- | -------------------------------------------------- |
| `HookContext` | `z.infer<ReturnType<typeof HookContextSchema<T>>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L28)

#### :gear: DocContext

Represents the context of a document operation within a collection.

| Type         | Type                                              |
| ------------ | ------------------------------------------------- |
| `DocContext` | `z.infer<ReturnType<typeof DocContextSchema<T>>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L58)

#### :gear: OnSetDocContext

The context provided to the `onSetDoc` hook.

This context contains information about the document being created or updated,
along with details about the user who triggered the operation.

| Type              | Type                                    |
| ----------------- | --------------------------------------- |
| `OnSetDocContext` | `z.infer<typeof OnSetDocContextSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L71)

#### :gear: AssertSetDocContext

The context provided to the `assertSetDoc` hook.

This context contains information about the document being validated before
it is created or updated. If validation fails, the developer should throw an error.

| Type                  | Type                                        |
| --------------------- | ------------------------------------------- |
| `AssertSetDocContext` | `z.infer<typeof AssertSetDocContextSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/context.ts#L84)

#### :gear: CollectionsConfig

| Type                | Type                                      |
| ------------------- | ----------------------------------------- |
| `CollectionsConfig` | `z.infer<typeof CollectionsConfigSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/collections.config.ts#L14)

#### :gear: SatelliteConfigEnv

| Type                 | Type                                       |
| -------------------- | ------------------------------------------ |
| `SatelliteConfigEnv` | `z.infer<typeof SatelliteConfigEnvSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/satellite.config.ts#L13)

#### :gear: AssertSetDocConfig

Configuration schema for an assertion that runs when a document is created or updated.

| Type                 | Type                                       |
| -------------------- | ------------------------------------------ |
| `AssertSetDocConfig` | `z.infer<typeof AssertSetDocConfigSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L30)

#### :gear: AssertConfig

All possible config for assertions.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `AssertConfig` | `z.infer<typeof AssertConfigSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L41)

#### :gear: AssertFn

| Type       | Type                                                        |
| ---------- | ----------------------------------------------------------- |
| `AssertFn` | `( config: z.infer<typeof SatelliteConfigEnvSchema> ) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L45)

#### :gear: AssertFnOrObject

| Type               | Type               |
| ------------------ | ------------------ |
| `AssertFnOrObject` | `T or AssertFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/assert.config.ts#L51)

#### :gear: OnSetDocConfig

Configuration for a hook that runs when a document is created or updated.

| Type             | Type                                   |
| ---------------- | -------------------------------------- |
| `OnSetDocConfig` | `z.infer<typeof OnSetDocConfigSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L30)

#### :gear: HookConfig

All possible config for assertions.

| Type         | Type                               |
| ------------ | ---------------------------------- |
| `HookConfig` | `z.infer<typeof HookConfigSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L41)

#### :gear: HookFn

| Type     | Type                                                      |
| -------- | --------------------------------------------------------- |
| `HookFn` | `(config: z.infer<typeof SatelliteConfigEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L45)

#### :gear: HookFnOrObject

| Type             | Type             |
| ---------------- | ---------------- |
| `HookFnOrObject` | `T or HookFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/configs/hook.config.ts#L49)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
