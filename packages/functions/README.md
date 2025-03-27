[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/functions
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/functions
[npm-license]: https://img.shields.io/npm/l/@junobuild/functions
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno Functions

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
- [call](#gear-call)
- [id](#gear-id)

#### :gear: HookContextSchema

| Function            | Type                                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookContextSchema` | `<T extends z.ZodTypeAny>(dataSchema: T) => ZodObject<typeof schemaShape, "strict", ZodTypeAny, baseObjectOutputType<typeof schemaShape>, baseObjectInputType<typeof schemaShape>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L8)

#### :gear: AssertFunctionSchema

| Function               | Type                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `AssertFunctionSchema` | `<T extends z.ZodTypeAny>(contextSchema: T) => ZodFunction<ZodTuple<[T], ZodUnknown>, ZodVoid>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L44)

#### :gear: RunFunctionSchema

| Function            | Type                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `RunFunctionSchema` | `<T extends z.ZodTypeAny>(contextSchema: T) => ZodFunction<ZodTuple<[T], ZodUnknown>, ZodUnion<[ZodPromise<ZodVoid>, ZodVoid]>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L59)

#### :gear: DocContextSchema

| Function           | Type                                                                                                                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocContextSchema` | `<T extends z.ZodTypeAny>(dataSchema: T) => ZodObject<typeof schemaShape, "strict", ZodTypeAny, baseObjectOutputType<typeof schemaShape>, baseObjectInputType<typeof schemaShape>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L17)

#### :gear: AssertFnSchema

| Function         | Type                                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `AssertFnSchema` | `<T extends z.ZodTypeAny>(assertSchema: T) => ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L53)

#### :gear: AssertFnOrObjectSchema

| Function                 | Type                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertFnOrObjectSchema` | `<T extends z.ZodTypeAny>(assertSchema: T) => ZodUnion<[T, ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L57)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L61)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L62)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L63)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L64)

#### :gear: HookFnSchema

| Function       | Type                                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `HookFnSchema` | `<T extends z.ZodTypeAny>(hookSchema: T) => ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L53)

#### :gear: HookFnOrObjectSchema

| Function               | Type                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `HookFnOrObjectSchema` | `<T extends z.ZodTypeAny>(hookSchema: T) => ZodUnion<[T, ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L57)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L61)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L62)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L63)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L64)

#### :gear: setDocStore

Stores or updates a document in the datastore.

The data must have been encoded - using encodeDocData - before calling this function.

| Function      | Type                                                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setDocStore` | `(params: { caller: Uint8Array<ArrayBufferLike> or Principal; collection: string; key: string; doc: { data: Uint8Array<ArrayBufferLike>; description?: string or undefined; version?: bigint or undefined; }; }) => void` |

Parameters:

- `params`: - The parameters required to store the document,
  including the caller, collection, key, and document data.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L15)

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

#### :gear: call

Makes an asynchronous call to a canister on the Internet Computer.

This function encodes the provided arguments using Candid, performs the canister call,
and decodes the response based on the expected result types.

| Function | Type                                    |
| -------- | --------------------------------------- |
| `call`   | `<T>(params: CallParams) => Promise<T>` |

Parameters:

- `params`: - The parameters required for the canister call

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/call.ic-cdk.ts#L20)

#### :gear: id

Retrieves the Satellite's Principal ID.

This function is a JavaScript binding for the Rust function
[`ic_cdk::id()`](https://docs.rs/ic-cdk/latest/ic_cdk/fn.id.html), which returns
the Principal of the executing canister.

| Function | Type              |
| -------- | ----------------- |
| `id`     | `() => Principal` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/id.ic-cdk.ts#L12)

### :wrench: Constants

- [Uint8ArraySchema](#gear-uint8arrayschema)
- [RawPrincipalSchema](#gear-rawprincipalschema)
- [PrincipalSchema](#gear-principalschema)
- [TimestampSchema](#gear-timestampschema)
- [VersionSchema](#gear-versionschema)
- [RawUserIdSchema](#gear-rawuseridschema)
- [UserIdSchema](#gear-useridschema)
- [CollectionSchema](#gear-collectionschema)
- [KeySchema](#gear-keyschema)
- [CollectionsSchema](#gear-collectionsschema)
- [DocDescriptionSchema](#gear-docdescriptionschema)
- [RawDataSchema](#gear-rawdataschema)
- [DocSchema](#gear-docschema)
- [DocUpsertSchema](#gear-docupsertschema)
- [SetDocSchema](#gear-setdocschema)
- [DelDocSchema](#gear-deldocschema)
- [DocAssertSetSchema](#gear-docassertsetschema)
- [DocAssertDeleteSchema](#gear-docassertdeleteschema)
- [OnSetDocContextSchema](#gear-onsetdoccontextschema)
- [OnSetManyDocsContextSchema](#gear-onsetmanydocscontextschema)
- [AssertSetDocContextSchema](#gear-assertsetdoccontextschema)
- [AssertDeleteDocContextSchema](#gear-assertdeletedoccontextschema)
- [SatelliteEnvSchema](#gear-satelliteenvschema)
- [AssertSetDocSchema](#gear-assertsetdocschema)
- [AssertDeleteDocSchema](#gear-assertdeletedocschema)
- [AssertSchema](#gear-assertschema)
- [OnSetDocSchema](#gear-onsetdocschema)
- [OnSetManyDocsSchema](#gear-onsetmanydocsschema)
- [HookSchema](#gear-hookschema)
- [SetDocStoreParamsSchema](#gear-setdocstoreparamsschema)
- [IDLTypeSchema](#gear-idltypeschema)
- [CallArgSchema](#gear-callargschema)
- [CallArgsSchema](#gear-callargsschema)
- [CallResultSchema](#gear-callresultschema)
- [CallParamsSchema](#gear-callparamsschema)

#### :gear: Uint8ArraySchema

A schema that validates a value is an Uint8Array.

| Constant           | Type                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| `Uint8ArraySchema` | `ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L7)

#### :gear: RawPrincipalSchema

| Constant             | Type                                                                            |
| -------------------- | ------------------------------------------------------------------------------- |
| `RawPrincipalSchema` | `ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L14)

#### :gear: PrincipalSchema

| Constant          | Type                                        |
| ----------------- | ------------------------------------------- |
| `PrincipalSchema` | `ZodType<Principal, ZodTypeDef, Principal>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L24)

#### :gear: TimestampSchema

| Constant          | Type        |
| ----------------- | ----------- |
| `TimestampSchema` | `ZodBigInt` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L7)

#### :gear: VersionSchema

| Constant        | Type        |
| --------------- | ----------- |
| `VersionSchema` | `ZodBigInt` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L19)

#### :gear: RawUserIdSchema

| Constant          | Type                                                                            |
| ----------------- | ------------------------------------------------------------------------------- |
| `RawUserIdSchema` | `ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L31)

#### :gear: UserIdSchema

| Constant       | Type                                        |
| -------------- | ------------------------------------------- |
| `UserIdSchema` | `ZodType<Principal, ZodTypeDef, Principal>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L43)

#### :gear: CollectionSchema

| Constant           | Type        |
| ------------------ | ----------- |
| `CollectionSchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L55)

#### :gear: KeySchema

| Constant    | Type        |
| ----------- | ----------- |
| `KeySchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L65)

#### :gear: CollectionsSchema

| Constant            | Type                                                                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CollectionsSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, "strict", ZodTypeAny, { collections: readonly string[]; }, { collections: readonly string[]; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/collections.ts#L7)

#### :gear: DocDescriptionSchema

| Constant               | Type        |
| ---------------------- | ----------- |
| `DocDescriptionSchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L15)

#### :gear: RawDataSchema

| Constant        | Type                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| `RawDataSchema` | `ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L25)

#### :gear: DocSchema

| Constant    | Type                                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocSchema` | `ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L37)

#### :gear: DocUpsertSchema

| Constant          | Type                                                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocUpsertSchema` | `ZodObject<{ before: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; after: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L15)

#### :gear: SetDocSchema

| Constant       | Type                                                                                                                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocSchema` | `ZodObject<{ data: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; description: ZodOptional<...>; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L43)

#### :gear: DelDocSchema

| Constant       | Type                                                                                                                                            |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `DelDocSchema` | `ZodObject<{ version: ZodOptional<ZodBigInt>; }, "strict", ZodTypeAny, { version?: bigint or undefined; }, { version?: bigint or undefined; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L75)

#### :gear: DocAssertSetSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocAssertSetSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; proposed: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L95)

#### :gear: DocAssertDeleteSchema

| Constant                | Type                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocAssertDeleteSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; proposed: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L125)

#### :gear: OnSetDocContextSchema

| Constant                | Type                                                                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L59)

#### :gear: OnSetManyDocsContextSchema

| Constant                     | Type                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetManyDocsContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L72)

#### :gear: AssertSetDocContextSchema

| Constant                    | Type                                                                                                                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L87)

#### :gear: AssertDeleteDocContextSchema

| Constant                       | Type                                                                                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L100)

#### :gear: SatelliteEnvSchema

| Constant             | Type                               |
| -------------------- | ---------------------------------- |
| `SatelliteEnvSchema` | `ZodRecord<ZodString, ZodUnknown>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/satellite.env.ts#L6)

#### :gear: AssertSetDocSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, Z...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L26)

#### :gear: AssertDeleteDocSchema

| Constant                | Type                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteDocSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, Z...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L36)

#### :gear: AssertSchema

| Constant       | Type                                                                                                                                                                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSchema` | `ZodUnion<[ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodU...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L46)

#### :gear: OnSetDocSchema

| Constant         | Type                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodU...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L26)

#### :gear: OnSetManyDocsSchema

| Constant              | Type                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetManyDocsSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodUn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L36)

#### :gear: HookSchema

| Constant     | Type                                                                                                                                                                                                                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookSchema` | `ZodUnion<[ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnkn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L46)

#### :gear: SetDocStoreParamsSchema

| Constant                  | Type                                                                                                                                                                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocStoreParamsSchema` | `ZodObject<{ caller: ZodUnion<[ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>, ZodType<...>]>; collection: ZodString; key: ZodString; doc: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L8)

#### :gear: IDLTypeSchema

| Constant        | Type                                                |
| --------------- | --------------------------------------------------- |
| `IDLTypeSchema` | `ZodType<Type<unknown>, ZodTypeDef, Type<unknown>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L9)

#### :gear: CallArgSchema

| Constant        | Type                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| `CallArgSchema` | `ZodTuple<[ZodType<Type<unknown>, ZodTypeDef, Type<unknown>>, ZodUnknown], null>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L21)

#### :gear: CallArgsSchema

Schema for encoding the call arguments.

| Constant         | Type                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `CallArgsSchema` | `ZodArray<ZodTuple<[ZodType<Type<unknown>, ZodTypeDef, Type<unknown>>, ZodUnknown], null>, "many">` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L33)

#### :gear: CallResultSchema

| Constant           | Type                                                |
| ------------------ | --------------------------------------------------- |
| `CallResultSchema` | `ZodType<Type<unknown>, ZodTypeDef, Type<unknown>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L49)

#### :gear: CallParamsSchema

| Constant           | Type                                                                                                                                                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CallParamsSchema` | `ZodObject<{ canisterId: ZodUnion<[ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>, ZodType<...>]>; method: ZodString; args: ZodOptional<...>; result: ZodOptional<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L59)

### :factory: CallResponseLengthError

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/types/errors.ts#L1)

### :tropical_drink: Interfaces

- [Collections](#gear-collections)
- [HookContext](#gear-hookcontext)
- [Doc](#gear-doc)
- [DocUpsert](#gear-docupsert)
- [SetDoc](#gear-setdoc)
- [DelDoc](#gear-deldoc)
- [DocAssertSet](#gear-docassertset)
- [DocAssertDelete](#gear-docassertdelete)
- [DocContext](#gear-doccontext)
- [CallParams](#gear-callparams)

#### :gear: Collections

Defines the collections where a hook or assertion should run.

| Property      | Type                | Description |
| ------------- | ------------------- | ----------- |
| `collections` | `readonly string[]` |             |

#### :gear: HookContext

Represents the context provided to hooks, containing information about the caller and related data.

| Property | Type                          | Description                                                                     |
| -------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `caller` | `Uint8Array<ArrayBufferLike>` | The user who originally triggered the function that in turn triggered the hook. |
| `data`   | `T`                           | The data associated with the hook execution.                                    |

#### :gear: Doc

Represents a document stored in a collection.

| Property      | Type                          | Description                                                                                                             |
| ------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `owner`       | `Uint8Array<ArrayBufferLike>` | The user who owns this document.                                                                                        |
| `data`        | `Uint8Array<ArrayBufferLike>` | The raw data of the document.                                                                                           |
| `description` | `string or undefined`         | An optional description of the document.                                                                                |
| `created_at`  | `bigint`                      | The timestamp when the document was first created.                                                                      |
| `updated_at`  | `bigint`                      | The timestamp when the document was last updated.                                                                       |
| `version`     | `bigint or undefined`         | The version number of the document, used for consistency checks. If not provided, it's assumed to be the first version. |

#### :gear: DocUpsert

Represents a document update operation.

This is used in hooks where a document is either being created or updated.

| Property | Type               | Description                                                                                  |
| -------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `before` | `Doc or undefined` | The previous version of the document before the update. Undefined if this is a new document. |
| `after`  | `Doc`              | The new version of the document after the update.                                            |

#### :gear: SetDoc

Represents the proposed version of a document to be created or updated.
This can be validated before allowing the operation.

| Property      | Type                          | Description                                        |
| ------------- | ----------------------------- | -------------------------------------------------- |
| `data`        | `Uint8Array<ArrayBufferLike>` | The raw data of the document.                      |
| `description` | `string or undefined`         | An optional description of the document.           |
| `version`     | `bigint or undefined`         | The expected version number to ensure consistency. |

#### :gear: DelDoc

Represents the proposed version of a document to be deleted.
This can be validated before allowing the operation.

| Property  | Type                  | Description                                        |
| --------- | --------------------- | -------------------------------------------------- |
| `version` | `bigint or undefined` | The expected version number to ensure consistency. |

#### :gear: DocAssertSet

Represents a validation check before setting a document.

The developer can compare the `current` and `proposed` versions and
throw an error if their validation fails.

| Property   | Type               | Description                                                                                    |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `current`  | `Doc or undefined` | The current version of the document before the operation. Undefined if this is a new document. |
| `proposed` | `SetDoc`           | The proposed version of the document. This can be validated before allowing the operation.     |

#### :gear: DocAssertDelete

Represents a validation check before deleting a document.

The developer can compare the `current` and `proposed` versions and
throw an error if their validation fails.

| Property   | Type               | Description                                                                                         |
| ---------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `current`  | `Doc or undefined` | The current version of the document before the operation. Undefined if the document does not exist. |
| `proposed` | `DelDoc`           | The proposed version of the document. This can be validated before allowing the operation.          |

#### :gear: DocContext

Represents the context of a document operation within a collection.

| Property     | Type     | Description                                                    |
| ------------ | -------- | -------------------------------------------------------------- |
| `collection` | `string` | The name of the collection where the document is stored.       |
| `key`        | `string` | The unique key identifying the document within the collection. |
| `data`       | `T`      | The data associated with the document operation.               |

#### :gear: CallParams

Type representing the parameters required to make a canister call.

| Property     | Type                                       | Description                                                       |
| ------------ | ------------------------------------------ | ----------------------------------------------------------------- |
| `canisterId` | `Uint8Array<ArrayBufferLike> or Principal` | The target canister's ID.                                         |
| `method`     | `string`                                   | The name of the method to call. Minimum one character.            |
| `args`       | `[Type<unknown>, unknown][] or undefined`  | The arguments, including types and values, for the canister call. |
| `result`     | `Type<unknown> or undefined`               | The expected result type used for decoding the response.          |

### :cocktail: Types

- [RawPrincipal](#gear-rawprincipal)
- [Principal](#gear-principal)
- [Timestamp](#gear-timestamp)
- [Version](#gear-version)
- [RawUserId](#gear-rawuserid)
- [UserId](#gear-userid)
- [Collection](#gear-collection)
- [Key](#gear-key)
- [AssertFunction](#gear-assertfunction)
- [RunFunction](#gear-runfunction)
- [DocDescription](#gear-docdescription)
- [RawData](#gear-rawdata)
- [OnSetDocContext](#gear-onsetdoccontext)
- [OnSetManyDocsContext](#gear-onsetmanydocscontext)
- [AssertSetDocContext](#gear-assertsetdoccontext)
- [AssertDeleteDocContext](#gear-assertdeletedoccontext)
- [SatelliteEnv](#gear-satelliteenv)
- [AssertSetDoc](#gear-assertsetdoc)
- [AssertDeleteDoc](#gear-assertdeletedoc)
- [Assert](#gear-assert)
- [AssertFn](#gear-assertfn)
- [AssertFnOrObject](#gear-assertfnorobject)
- [OnSetDoc](#gear-onsetdoc)
- [OnSetManyDocs](#gear-onsetmanydocs)
- [Hook](#gear-hook)
- [HookFn](#gear-hookfn)
- [HookFnOrObject](#gear-hookfnorobject)
- [SetDocStoreParams](#gear-setdocstoreparams)
- [IDLType](#gear-idltype)
- [CallArg](#gear-callarg)
- [CallArgs](#gear-callargs)
- [CallResult](#gear-callresult)

#### :gear: RawPrincipal

Represents a raw principal - a Uint8Array representation of a Principal.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `RawPrincipal` | `z.infer<typeof RawPrincipalSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L19)

#### :gear: Principal

Represents a principal - i.e. an object instantiated with the class Principal.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `Principal` | `z.infer<typeof PrincipalSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L31)

#### :gear: Timestamp

Represents a timestamp in nanoseconds since the Unix epoch.

Used for tracking when events occur, such as document creation and updates.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `Timestamp` | `z.infer<typeof TimestampSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L14)

#### :gear: Version

Represents a version number for tracking changes.

This is typically incremented with each update to ensure consistency.

| Type      | Type                            |
| --------- | ------------------------------- |
| `Version` | `z.infer<typeof VersionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L26)

#### :gear: RawUserId

Represents a raw user identifier.

This is a principal associated with a user.

| Type        | Type                              |
| ----------- | --------------------------------- |
| `RawUserId` | `z.infer<typeof RawUserIdSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L38)

#### :gear: UserId

Represents a user identifier.

This is a principal associated with a user.

| Type     | Type                           |
| -------- | ------------------------------ |
| `UserId` | `z.infer<typeof UserIdSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L50)

#### :gear: Collection

A collection name where data are stored.

| Type         | Type                               |
| ------------ | ---------------------------------- |
| `Collection` | `z.infer<typeof CollectionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L60)

#### :gear: Key

A unique key identifier within a collection.

| Type  | Type                        |
| ----- | --------------------------- |
| `Key` | `z.infer<typeof KeySchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L70)

#### :gear: AssertFunction

Defines the `assert` function schema for assertions.

The function takes a context argument and returns `void`.

| Type             | Type                   |
| ---------------- | ---------------------- |
| `AssertFunction` | `(context: T) => void` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L54)

#### :gear: RunFunction

Defines the `run` function schema for hooks.

The function takes a context argument and returns either a `Promise<void>` or `void`.

| Type          | Type                                    |
| ------------- | --------------------------------------- |
| `RunFunction` | `(context: T) => void or Promise<void>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L69)

#### :gear: DocDescription

Represents a document description with a maximum length of 1024 characters.

| Type             | Type                                   |
| ---------------- | -------------------------------------- |
| `DocDescription` | `z.infer<typeof DocDescriptionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L20)

#### :gear: RawData

Represents raw binary data.

This is used to store structured data in a document.

| Type      | Type                               |
| --------- | ---------------------------------- |
| `RawData` | `z.infer<typeof Uint8ArraySchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L32)

#### :gear: OnSetDocContext

The context provided to the `onSetDoc` hook.

This context contains information about the document being created or updated,
along with details about the user who triggered the operation.

| Type              | Type                                 |
| ----------------- | ------------------------------------ |
| `OnSetDocContext` | `HookContext<DocContext<DocUpsert>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L67)

#### :gear: OnSetManyDocsContext

The context provided to the `onSetManyDocs` hook.

This context contains information about multiple documents being created or updated
in a single operation, along with details about the user who triggered it.

| Type                   | Type                                   |
| ---------------------- | -------------------------------------- |
| `OnSetManyDocsContext` | `HookContext<DocContext<DocUpsert>[]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L82)

#### :gear: AssertSetDocContext

The context provided to the `assertDeleteDoc` hook.

This context contains information about the document being validated before
it is created or updated. If validation fails, the developer should throw an error.

| Type                  | Type                                    |
| --------------------- | --------------------------------------- |
| `AssertSetDocContext` | `HookContext<DocContext<DocAssertSet>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L95)

#### :gear: AssertDeleteDocContext

The context provided to the `assertDeleteDoc` hook.

This context contains information about the document being validated before
it is deleted. If validation fails, the developer should throw an error.

| Type                     | Type                                       |
| ------------------------ | ------------------------------------------ |
| `AssertDeleteDocContext` | `HookContext<DocContext<DocAssertDelete>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L110)

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

#### :gear: AssertDeleteDoc

An assertion that runs when a document is deleted.

| Type              | Type                                    |
| ----------------- | --------------------------------------- |
| `AssertDeleteDoc` | `z.infer<typeof AssertDeleteDocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L41)

#### :gear: Assert

All assertions definitions.

| Type     | Type                           |
| -------- | ------------------------------ |
| `Assert` | `z.infer<typeof AssertSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L51)

#### :gear: AssertFn

| Type       | Type                                                |
| ---------- | --------------------------------------------------- |
| `AssertFn` | `(assert: z.infer<typeof SatelliteEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L55)

#### :gear: AssertFnOrObject

| Type               | Type               |
| ------------------ | ------------------ |
| `AssertFnOrObject` | `T or AssertFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/assertions.ts#L59)

#### :gear: OnSetDoc

A hook that runs when a document is created or updated.

| Type       | Type                             |
| ---------- | -------------------------------- |
| `OnSetDoc` | `z.infer<typeof OnSetDocSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L31)

#### :gear: OnSetManyDocs

A hook that runs when multiple documents are created or updated.

| Type            | Type                                  |
| --------------- | ------------------------------------- |
| `OnSetManyDocs` | `z.infer<typeof OnSetManyDocsSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L41)

#### :gear: Hook

All hooks definitions.

| Type   | Type                         |
| ------ | ---------------------------- |
| `Hook` | `z.infer<typeof HookSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L51)

#### :gear: HookFn

| Type     | Type                                              |
| -------- | ------------------------------------------------- |
| `HookFn` | `(hook: z.infer<typeof SatelliteEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L55)

#### :gear: HookFnOrObject

| Type             | Type             |
| ---------------- | ---------------- |
| `HookFnOrObject` | `T or HookFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/db/hooks.ts#L59)

#### :gear: SetDocStoreParams

Represents the parameters required to store or update a document.

This includes the document data along with metadata such as the caller,
collection, and key.

| Type                | Type                                      |
| ------------------- | ----------------------------------------- |
| `SetDocStoreParams` | `z.infer<typeof SetDocStoreParamsSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L38)

#### :gear: IDLType

Custom validation function to verify if a value is an instance of `IDL.Type` from `@dfinity/candid`.

| Type      | Type                            |
| --------- | ------------------------------- |
| `IDLType` | `z.infer<typeof IDLTypeSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L16)

#### :gear: CallArg

A call argument consisting of its IDL type and corresponding value.

| Type      | Type                            |
| --------- | ------------------------------- |
| `CallArg` | `z.infer<typeof CallArgSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L26)

#### :gear: CallArgs

Represents the arguments for a canister call on the IC.

Requests and responses on the IC are encoded using Candid.
This schema ensures that each argument is provided with both its type and value
for proper encoding.

The order of arguments is preserved for the function call.

| Type       | Type                             |
| ---------- | -------------------------------- |
| `CallArgs` | `z.infer<typeof CallArgsSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L44)

#### :gear: CallResult

Defines the type used to decode the result of a canister call.

| Type         | Type                               |
| ------------ | ---------------------------------- |
| `CallResult` | `z.infer<typeof CallResultSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L54)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
