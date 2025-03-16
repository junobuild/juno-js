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

- [HookContextSchema](#gear-hookcontextschema)
- [AssertFunctionSchema](#gear-assertfunctionschema)
- [RunFunctionSchema](#gear-runfunctionschema)
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
- [setDocStore](#gear-setdocstore)
- [decodeDocData](#gear-decodedocdata)
- [encodeDocData](#gear-encodedocdata)
- [id](#gear-id)

#### :gear: HookContextSchema

| Function            | Type                                                                                                                                                                                                                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookContextSchema` | `<T extends z.ZodTypeAny>(dataSchema: T) => ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: T; }, "strict", ZodTypeAny, { [k in keyof addQuestionMarks<...>]: addQuestionMarks<...>[k]; }, { [k in keyof baseObjectInputType<...>]: baseObjectInputType<...>[k]; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L7)

#### :gear: AssertFunctionSchema

| Function               | Type                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `AssertFunctionSchema` | `<T extends z.ZodTypeAny>(contextSchema: T) => ZodFunction<ZodTuple<[T], ZodUnknown>, ZodVoid>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L32)

#### :gear: RunFunctionSchema

| Function            | Type                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `RunFunctionSchema` | `<T extends z.ZodTypeAny>(contextSchema: T) => ZodFunction<ZodTuple<[T], ZodUnknown>, ZodPromise<ZodVoid>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L49)

#### :gear: DocContextSchema

| Function           | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocContextSchema` | `<T extends z.ZodTypeAny>(dataSchema: T) => ZodObject<{ collection: ZodString; key: ZodString; data: T; }, "strict", ZodTypeAny, { [k in keyof addQuestionMarks<baseObjectOutputType<{ collection: ZodString; key: ZodString; data: T; }>, any>]: addQuestionMarks<...>[k]; }, { [k in keyof baseObjectInputType<...>]: baseOb...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L9)

#### :gear: AssertFnSchema

| Function         | Type                                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `AssertFnSchema` | `<T extends z.ZodTypeAny>(assertSchema: T) => ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L44)

#### :gear: AssertFnOrObjectSchema

| Function                 | Type                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertFnOrObjectSchema` | `<T extends z.ZodTypeAny>(assertSchema: T) => ZodUnion<[T, ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L48)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L52)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L53)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L54)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L55)

#### :gear: HookFnSchema

| Function       | Type                                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `HookFnSchema` | `<T extends z.ZodTypeAny>(hookSchema: T) => ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L44)

#### :gear: HookFnOrObjectSchema

| Function               | Type                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `HookFnOrObjectSchema` | `<T extends z.ZodTypeAny>(hookSchema: T) => ZodUnion<[T, ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L48)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L52)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L53)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L54)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L55)

#### :gear: setDocStore

Stores or updates a document in the datastore.

The data must have been encoded - using encodeDocData - before calling this function.

| Function      | Type                                                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `setDocStore` | `(params: { caller: Uint8Array<ArrayBufferLike>; collection: string; doc: { data: Uint8Array<ArrayBufferLike>; key: string; description?: string or undefined; version?: bigint or undefined; }; }) => void` |

Parameters:

- `params`: - The parameters required to store the document,
  including the caller, collection, key, and document data.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L14)

#### :gear: decodeDocData

Decodes the raw data of a document into a JavaScript object.

| Function        | Type                                          |
| --------------- | --------------------------------------------- |
| `decodeDocData` | `<T>(data: Uint8Array<ArrayBufferLike>) => T` |

Parameters:

- `data`: - The raw data to be decoded.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/serializer.sdk.ts#L11)

#### :gear: encodeDocData

Encodes a JavaScript object into a raw data format to be applied to a document.

| Function        | Type                                          |
| --------------- | --------------------------------------------- |
| `encodeDocData` | `<T>(data: T) => Uint8Array<ArrayBufferLike>` |

Parameters:

- `data`: - The data to be encoded.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/serializer.sdk.ts#L21)

#### :gear: id

Retrieves the Satellite's Principal ID.

This function is a JavaScript binding for the Rust function
[`ic_cdk::id()`](https://docs.rs/ic-cdk/latest/ic_cdk/fn.id.html), which returns
the Principal of the executing canister.

| Function | Type              |
| -------- | ----------------- |
| `id`     | `() => Principal` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/id.ts#L12)

### :wrench: Constants

- [CollectionsSchema](#gear-collectionsschema)
- [RawPrincipalSchema](#gear-rawprincipalschema)
- [TimestampSchema](#gear-timestampschema)
- [VersionSchema](#gear-versionschema)
- [RawDataSchema](#gear-rawdataschema)
- [RawUserIdSchema](#gear-rawuseridschema)
- [CollectionSchema](#gear-collectionschema)
- [KeySchema](#gear-keyschema)
- [DocDescriptionSchema](#gear-docdescriptionschema)
- [DocSchema](#gear-docschema)
- [DocUpsertSchema](#gear-docupsertschema)
- [ProposedDocSchema](#gear-proposeddocschema)
- [DocAssertSetSchema](#gear-docassertsetschema)
- [OnSetDocContextSchema](#gear-onsetdoccontextschema)
- [AssertSetDocContextSchema](#gear-assertsetdoccontextschema)
- [SatelliteEnvSchema](#gear-satelliteenvschema)
- [AssertSetDocSchema](#gear-assertsetdocschema)
- [AssertSchema](#gear-assertschema)
- [OnSetDocSchema](#gear-onsetdocschema)
- [HookSchema](#gear-hookschema)
- [SetDocSchema](#gear-setdocschema)
- [SetDocStoreParamsSchema](#gear-setdocstoreparamsschema)

#### :gear: CollectionsSchema

| Constant            | Type                                                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `CollectionsSchema` | `ZodObject<{ collections: ZodArray<ZodString, "many">; }, "strict", ZodTypeAny, { collections: string[]; }, { collections: string[]; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/collections.ts#L6)

#### :gear: RawPrincipalSchema

| Constant             | Type                                                                            |
| -------------------- | ------------------------------------------------------------------------------- |
| `RawPrincipalSchema` | `ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L6)

#### :gear: TimestampSchema

| Constant          | Type        |
| ----------------- | ----------- |
| `TimestampSchema` | `ZodBigInt` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L7)

#### :gear: VersionSchema

| Constant        | Type        |
| --------------- | ----------- |
| `VersionSchema` | `ZodBigInt` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L19)

#### :gear: RawDataSchema

| Constant        | Type                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| `RawDataSchema` | `ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L31)

#### :gear: RawUserIdSchema

| Constant          | Type                                                                            |
| ----------------- | ------------------------------------------------------------------------------- |
| `RawUserIdSchema` | `ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L45)

#### :gear: CollectionSchema

| Constant           | Type        |
| ------------------ | ----------- |
| `CollectionSchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L57)

#### :gear: KeySchema

| Constant    | Type        |
| ----------- | ----------- |
| `KeySchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L67)

#### :gear: DocDescriptionSchema

| Constant               | Type        |
| ---------------------- | ----------- |
| `DocDescriptionSchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L7)

#### :gear: DocSchema

| Constant    | Type                                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocSchema` | `ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L17)

#### :gear: DocUpsertSchema

| Constant          | Type                                                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocUpsertSchema` | `ZodObject<{ before: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; after: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L8)

#### :gear: ProposedDocSchema

| Constant            | Type                                                                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProposedDocSchema` | `ZodObject<{ data: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; description: ZodOptional<...>; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L33)

#### :gear: DocAssertSetSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocAssertSetSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; proposed: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L61)

#### :gear: OnSetDocContextSchema

| Constant                | Type                                                                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L39)

#### :gear: AssertSetDocContextSchema

| Constant                    | Type                                                                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L52)

#### :gear: SatelliteEnvSchema

| Constant             | Type                               |
| -------------------- | ---------------------------------- |
| `SatelliteEnvSchema` | `ZodRecord<ZodString, ZodUnknown>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/satellite.env.ts#L6)

#### :gear: AssertSetDocSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocSchema` | `ZodObject<extendShape<{ collections: ZodArray<ZodString, "many">; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>], ZodUnknown>, ZodVoid>; }>, "strict", ZodTypeAny, { ...; }, {...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L26)

#### :gear: AssertSchema

| Constant       | Type                                                                                                                                                                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSchema` | `ZodObject<extendShape<{ collections: ZodArray<ZodString, "many">; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>], ZodUnknown>, ZodVoid>; }>, "strict", ZodTypeAny, { ...; }, {...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L37)

#### :gear: OnSetDocSchema

| Constant         | Type                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocSchema` | `ZodObject<extendShape<{ collections: ZodArray<ZodString, "many">; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>], ZodUnknown>, ZodPromise<...>>; }>, "strict", ZodTypeAny, { ...;...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L26)

#### :gear: HookSchema

| Constant     | Type                                                                                                                                                                                                                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookSchema` | `ZodObject<extendShape<{ collections: ZodArray<ZodString, "many">; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>], ZodUnknown>, ZodPromise<...>>; }>, "strict", ZodTypeAny, { ...;...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L37)

#### :gear: SetDocSchema

| Constant       | Type                                                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocSchema` | `ZodObject<{ key: ZodString; description: ZodOptional<ZodString>; data: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L14)

#### :gear: SetDocStoreParamsSchema

| Constant                  | Type                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocStoreParamsSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; collection: ZodString; doc: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L49)

### :cocktail: Types

- [Collections](#gear-collections)
- [RawPrincipal](#gear-rawprincipal)
- [Timestamp](#gear-timestamp)
- [Version](#gear-version)
- [RawData](#gear-rawdata)
- [RawUserId](#gear-rawuserid)
- [Collection](#gear-collection)
- [Key](#gear-key)
- [HookContext](#gear-hookcontext)
- [AssertFunction](#gear-assertfunction)
- [RunFunction](#gear-runfunction)
- [DocDescription](#gear-docdescription)
- [Doc](#gear-doc)
- [DocUpsert](#gear-docupsert)
- [ProposedDoc](#gear-proposeddoc)
- [DocAssertSet](#gear-docassertset)
- [DocContext](#gear-doccontext)
- [OnSetDocContext](#gear-onsetdoccontext)
- [AssertSetDocContext](#gear-assertsetdoccontext)
- [SatelliteEnv](#gear-satelliteenv)
- [AssertSetDoc](#gear-assertsetdoc)
- [Assert](#gear-assert)
- [AssertFn](#gear-assertfn)
- [AssertFnOrObject](#gear-assertfnorobject)
- [OnSetDoc](#gear-onsetdoc)
- [Hook](#gear-hook)
- [HookFn](#gear-hookfn)
- [HookFnOrObject](#gear-hookfnorobject)
- [SetDoc](#gear-setdoc)
- [SetDocStoreParams](#gear-setdocstoreparams)

#### :gear: Collections

Defines the collections where a hook or assertion should run.

| Type          | Type                                |
| ------------- | ----------------------------------- |
| `Collections` | `z.infer<typeof CollectionsSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/collections.ts#L18)

#### :gear: RawPrincipal

Represents a raw principal identifier.

Principals are unique identities used in authentication and authorization.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `RawPrincipal` | `z.infer<typeof RawPrincipalSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L15)

#### :gear: Timestamp

Represents a timestamp in nanoseconds since the Unix epoch.

Used for tracking when events occur, such as document creation and updates.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `Timestamp` | `z.infer<typeof TimestampSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L14)

#### :gear: Version

Represents a version number for tracking changes.

This is typically incremented with each update to ensure consistency.

| Type      | Type                            |
| --------- | ------------------------------- |
| `Version` | `z.infer<typeof VersionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L26)

#### :gear: RawData

Represents raw binary data.

This is used to store unstructured data in a document.

| Type      | Type                            |
| --------- | ------------------------------- |
| `RawData` | `z.infer<typeof RawDataSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L40)

#### :gear: RawUserId

Represents a raw user identifier.

This is a principal associated with a user.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `RawUserId` | `z.infer<typeof RawUserIdSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L52)

#### :gear: Collection

A collection name where data are stored.

| Type         | Type                               |
| ------------ | ---------------------------------- |
| `Collection` | `z.infer<typeof CollectionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L62)

#### :gear: Key

A unique key identifier within a collection.

| Type  | Type                        |
| ----- | --------------------------- |
| `Key` | `z.infer<typeof KeySchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/core.ts#L72)

#### :gear: HookContext

Represents the context provided to hooks, containing information about the caller and related data.

| Type          | Type                                               |
| ------------- | -------------------------------------------------- |
| `HookContext` | `z.infer<ReturnType<typeof HookContextSchema<T>>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L27)

#### :gear: AssertFunction

Defines the `assert` function schema for assertions.

The function takes a context argument and returns `void`.

| Type             | Type                                                    |
| ---------------- | ------------------------------------------------------- |
| `AssertFunction` | `z.infer< ReturnType<typeof AssertFunctionSchema<T>> >` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L42)

#### :gear: RunFunction

Defines the `run` function schema for hooks.

The function takes a context argument and returns a `Promise<void>`.

| Type          | Type                                               |
| ------------- | -------------------------------------------------- |
| `RunFunction` | `z.infer<ReturnType<typeof RunFunctionSchema<T>>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L59)

#### :gear: DocDescription

Represents a document description with a maximum length of 1024 characters.

| Type             | Type                                   |
| ---------------- | -------------------------------------- |
| `DocDescription` | `z.infer<typeof DocDescriptionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L12)

#### :gear: Doc

Represents a document stored in a collection.

| Type  | Type                        |
| ----- | --------------------------- |
| `Doc` | `z.infer<typeof DocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L55)

#### :gear: DocUpsert

Represents a document update operation.

This is used in hooks where a document is either being created or updated.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `DocUpsert` | `z.infer<typeof DocUpsertSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L28)

#### :gear: ProposedDoc

Represents the proposed version of a document.
This can be validated before allowing the operation.

| Type          | Type                                |
| ------------- | ----------------------------------- |
| `ProposedDoc` | `z.infer<typeof ProposedDocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L56)

#### :gear: DocAssertSet

Represents a validation check before setting a document.

The developer can compare the `current` and `proposed` versions and
throw an error if their validation fails.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `DocAssertSet` | `z.infer<typeof DocAssertSetSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L83)

#### :gear: DocContext

Represents the context of a document operation within a collection.

| Type         | Type                                              |
| ------------ | ------------------------------------------------- |
| `DocContext` | `z.infer<ReturnType<typeof DocContextSchema<T>>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L34)

#### :gear: OnSetDocContext

The context provided to the `onSetDoc` hook.

This context contains information about the document being created or updated,
along with details about the user who triggered the operation.

| Type              | Type                                    |
| ----------------- | --------------------------------------- |
| `OnSetDocContext` | `z.infer<typeof OnSetDocContextSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L47)

#### :gear: AssertSetDocContext

The context provided to the `assertSetDoc` hook.

This context contains information about the document being validated before
it is created or updated. If validation fails, the developer should throw an error.

| Type                  | Type                                        |
| --------------------- | ------------------------------------------- |
| `AssertSetDocContext` | `z.infer<typeof AssertSetDocContextSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L60)

#### :gear: SatelliteEnv

Placeholder for future environment-specific configurations.

Currently unused, but it may support features such as:

- Defining the execution mode (e.g., staging or production).
- Providing environment-specific values like `ckBtcLedgerId` for test or production.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `SatelliteEnv` | `z.infer<typeof SatelliteEnvSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/satellite.env.ts#L15)

#### :gear: AssertSetDoc

An assertion that runs when a document is created or updated.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `AssertSetDoc` | `z.infer<typeof AssertSetDocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L31)

#### :gear: Assert

All assertions definitions.

| Type     | Type                           |
| -------- | ------------------------------ |
| `Assert` | `z.infer<typeof AssertSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L42)

#### :gear: AssertFn

| Type       | Type                                                |
| ---------- | --------------------------------------------------- |
| `AssertFn` | `(assert: z.infer<typeof SatelliteEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L46)

#### :gear: AssertFnOrObject

| Type               | Type               |
| ------------------ | ------------------ |
| `AssertFnOrObject` | `T or AssertFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L50)

#### :gear: OnSetDoc

A hook that runs when a document is created or updated.

| Type       | Type                             |
| ---------- | -------------------------------- |
| `OnSetDoc` | `z.infer<typeof OnSetDocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L31)

#### :gear: Hook

All hooks definitions.

| Type   | Type                         |
| ------ | ---------------------------- |
| `Hook` | `z.infer<typeof HookSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L42)

#### :gear: HookFn

| Type     | Type                                              |
| -------- | ------------------------------------------------- |
| `HookFn` | `(hook: z.infer<typeof SatelliteEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L46)

#### :gear: HookFnOrObject

| Type             | Type             |
| ---------------- | ---------------- |
| `HookFnOrObject` | `T or HookFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L50)

#### :gear: SetDoc

Represents a request to set or update a document.

This is used when submitting new document data.

| Type     | Type                           |
| -------- | ------------------------------ |
| `SetDoc` | `z.infer<typeof SetDocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L44)

#### :gear: SetDocStoreParams

Represents the parameters required to store or update a document.

This includes the document data along with metadata such as the caller,
collection, and key.

| Type                | Type                                      |
| ------------------- | ----------------------------------------- |
| `SetDocStoreParams` | `z.infer<typeof SetDocStoreParamsSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L74)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
