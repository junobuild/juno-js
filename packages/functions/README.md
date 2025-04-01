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
- [getAdminControllers](#gear-getadmincontrollers)
- [getControllers](#gear-getcontrollers)
- [isAdminController](#gear-isadmincontroller)
- [isController](#gear-iscontroller)
- [setDocStore](#gear-setdocstore)
- [deleteDocStore](#gear-deletedocstore)
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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L18)

#### :gear: AssertFnSchema

| Function         | Type                                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `AssertFnSchema` | `<T extends z.ZodTypeAny>(assertSchema: T) => ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L96)

#### :gear: AssertFnOrObjectSchema

| Function                 | Type                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertFnOrObjectSchema` | `<T extends z.ZodTypeAny>(assertSchema: T) => ZodUnion<[T, ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L100)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L104)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L105)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L106)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L107)

#### :gear: HookFnSchema

| Function       | Type                                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| `HookFnSchema` | `<T extends z.ZodTypeAny>(hookSchema: T) => ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L170)

#### :gear: HookFnOrObjectSchema

| Function               | Type                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `HookFnOrObjectSchema` | `<T extends z.ZodTypeAny>(hookSchema: T) => ZodUnion<[T, ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodUnknown>], ZodUnknown>, T>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L174)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L178)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L179)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L180)

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L181)

#### :gear: getAdminControllers

Gets the list of admin controllers from the Satellite.

| Function              | Type                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getAdminControllers` | `() => [Uint8Array<ArrayBufferLike>, { created_at: bigint; updated_at: bigint; metadata: [string, string][]; scope: "write" or "admin"; expires_at?: bigint or undefined; }][]` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/controllers.sdk.ts#L15)

#### :gear: getControllers

Gets the list of controllers from the Satellite.

| Function         | Type                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getControllers` | `() => [Uint8Array<ArrayBufferLike>, { created_at: bigint; updated_at: bigint; metadata: [string, string][]; scope: "write" or "admin"; expires_at?: bigint or undefined; }][]` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/controllers.sdk.ts#L25)

#### :gear: isAdminController

Checks if the given caller is an admin among the provided controllers.

| Function            | Type                                         |
| ------------------- | -------------------------------------------- |
| `isAdminController` | `(params: ControllerCheckParams) => boolean` |

Parameters:

- `params`: - The parameters including the caller identity
  and the list of controllers to verify against.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/controllers.sdk.ts#L37)

#### :gear: isController

Checks if the given caller exists among the provided controllers.

| Function       | Type                                         |
| -------------- | -------------------------------------------- |
| `isController` | `(params: ControllerCheckParams) => boolean` |

Parameters:

- `params`: - The parameters including the caller identity
  and the list of controllers to verify against.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/controllers.sdk.ts#L59)

#### :gear: setDocStore

Stores or updates a document in the datastore.

The data must have been encoded - using encodeDocData - before calling this function.

| Function      | Type                                  |
| ------------- | ------------------------------------- |
| `setDocStore` | `(params: SetDocStoreParams) => void` |

Parameters:

- `params`: - The parameters required to store the document,
  including the caller, collection, key, and document data.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L20)

#### :gear: deleteDocStore

Delete a document in the datastore.

| Function         | Type                                     |
| ---------------- | ---------------------------------------- |
| `deleteDocStore` | `(params: DeleteDocStoreParams) => void` |

Parameters:

- `params`: - The parameters required to delete the document,
  including the caller, collection, key, and version of the document.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L40)

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
- [DescriptionSchema](#gear-descriptionschema)
- [CollectionsSchema](#gear-collectionsschema)
- [RawDataSchema](#gear-rawdataschema)
- [DocSchema](#gear-docschema)
- [OptionDocSchema](#gear-optiondocschema)
- [SetDocSchema](#gear-setdocschema)
- [DelDocSchema](#gear-deldocschema)
- [DocUpsertSchema](#gear-docupsertschema)
- [DocAssertSetSchema](#gear-docassertsetschema)
- [DocAssertDeleteSchema](#gear-docassertdeleteschema)
- [OnSetDocContextSchema](#gear-onsetdoccontextschema)
- [OnSetManyDocsContextSchema](#gear-onsetmanydocscontextschema)
- [OnDeleteDocContextSchema](#gear-ondeletedoccontextschema)
- [OnDeleteManyDocsContextSchema](#gear-ondeletemanydocscontextschema)
- [OnDeleteFilteredDocsContextSchema](#gear-ondeletefiltereddocscontextschema)
- [AssertSetDocContextSchema](#gear-assertsetdoccontextschema)
- [AssertDeleteDocContextSchema](#gear-assertdeletedoccontextschema)
- [SatelliteEnvSchema](#gear-satelliteenvschema)
- [AssetSchema](#gear-assetschema)
- [BatchSchema](#gear-batchschema)
- [CommitBatchSchema](#gear-commitbatchschema)
- [AssetAssertUploadSchema](#gear-assetassertuploadschema)
- [OnUploadAssetContextSchema](#gear-onuploadassetcontextschema)
- [OnDeleteAssetContextSchema](#gear-ondeleteassetcontextschema)
- [OnDeleteManyAssetsContextSchema](#gear-ondeletemanyassetscontextschema)
- [OnDeleteFilteredAssetsContextSchema](#gear-ondeletefilteredassetscontextschema)
- [AssertUploadAssetContextSchema](#gear-assertuploadassetcontextschema)
- [AssertDeleteAssetContextSchema](#gear-assertdeleteassetcontextschema)
- [AssertSetDocSchema](#gear-assertsetdocschema)
- [AssertDeleteDocSchema](#gear-assertdeletedocschema)
- [AssertUploadAssetSchema](#gear-assertuploadassetschema)
- [AssertDeleteAssetSchema](#gear-assertdeleteassetschema)
- [AssertSchema](#gear-assertschema)
- [OnSetDocSchema](#gear-onsetdocschema)
- [OnSetManyDocsSchema](#gear-onsetmanydocsschema)
- [OnDeleteDocSchema](#gear-ondeletedocschema)
- [OnDeleteManyDocsSchema](#gear-ondeletemanydocsschema)
- [OnDeleteFilteredDocsSchema](#gear-ondeletefiltereddocsschema)
- [OnUploadAssetSchema](#gear-onuploadassetschema)
- [OnDeleteAssetSchema](#gear-ondeleteassetschema)
- [OnDeleteManyAssetsSchema](#gear-ondeletemanyassetsschema)
- [OnDeleteFilteredAssetsSchema](#gear-ondeletefilteredassetsschema)
- [HookSchema](#gear-hookschema)
- [ControllerScopeSchema](#gear-controllerscopeschema)
- [MetadataSchema](#gear-metadataschema)
- [ControllerSchema](#gear-controllerschema)
- [ControllerRecordSchema](#gear-controllerrecordschema)
- [ControllersSchema](#gear-controllersschema)
- [ControllerCheckParamsSchema](#gear-controllercheckparamsschema)
- [SetDocStoreParamsSchema](#gear-setdocstoreparamsschema)
- [DeleteDocStoreParamsSchema](#gear-deletedocstoreparamsschema)
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

#### :gear: DescriptionSchema

| Constant            | Type        |
| ------------------- | ----------- |
| `DescriptionSchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L75)

#### :gear: CollectionsSchema

| Constant            | Type                                                                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CollectionsSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, "strict", ZodTypeAny, { collections: readonly string[]; }, { collections: readonly string[]; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/collections.ts#L7)

#### :gear: RawDataSchema

| Constant        | Type                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| `RawDataSchema` | `ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L17)

#### :gear: DocSchema

| Constant    | Type                                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocSchema` | `ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L29)

#### :gear: OptionDocSchema

| Constant          | Type                                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OptionDocSchema` | `ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L79)

#### :gear: SetDocSchema

| Constant       | Type                                                                                                                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocSchema` | `ZodObject<{ data: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; description: ZodOptional<...>; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L89)

#### :gear: DelDocSchema

| Constant       | Type                                                                                                                                            |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `DelDocSchema` | `ZodObject<{ version: ZodOptional<ZodBigInt>; }, "strict", ZodTypeAny, { version?: bigint or undefined; }, { version?: bigint or undefined; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L121)

#### :gear: DocUpsertSchema

| Constant          | Type                                                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocUpsertSchema` | `ZodObject<{ before: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; after: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L14)

#### :gear: DocAssertSetSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocAssertSetSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; proposed: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L41)

#### :gear: DocAssertDeleteSchema

| Constant                | Type                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocAssertDeleteSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>>; proposed: ZodObject<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L71)

#### :gear: OnSetDocContextSchema

| Constant                | Type                                                                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L60)

#### :gear: OnSetManyDocsContextSchema

| Constant                     | Type                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetManyDocsContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L73)

#### :gear: OnDeleteDocContextSchema

| Constant                   | Type                                                                                                                                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L88)

#### :gear: OnDeleteManyDocsContextSchema

| Constant                        | Type                                                                                                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteManyDocsContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L101)

#### :gear: OnDeleteFilteredDocsContextSchema

| Constant                            | Type                                                                                                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteFilteredDocsContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L116)

#### :gear: AssertSetDocContextSchema

| Constant                    | Type                                                                                                                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L131)

#### :gear: AssertDeleteDocContextSchema

| Constant                       | Type                                                                                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteDocContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L144)

#### :gear: SatelliteEnvSchema

| Constant             | Type                               |
| -------------------- | ---------------------------------- |
| `SatelliteEnvSchema` | `ZodRecord<ZodString, ZodUnknown>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/satellite.env.ts#L6)

#### :gear: AssetSchema

| Constant      | Type                                                                                                                                                                                                                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssetSchema` | `ZodObject<{ key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; description: ZodOptional<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>; ... 4 more ...; version: ZodOptional<...>; },...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L144)

#### :gear: BatchSchema

| Constant      | Type                                                                                                                                                                                                                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BatchSchema` | `ZodObject<{ key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; description: ZodOptional<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>; reference_id: ZodOptional<...>; expires_at: Z...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L213)

#### :gear: CommitBatchSchema

| Constant            | Type                                                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CommitBatchSchema` | `ZodObject<{ batch_id: ZodBigInt; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>, "many">; chunk_ids: ZodArray<ZodBigInt, "many">; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L270)

#### :gear: AssetAssertUploadSchema

| Constant                  | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssetAssertUploadSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodType<...>; description: ZodOptional<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>; ... 4 more ...; version: ZodOptional<...>; }, "strict", ZodTypeAn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/payload.ts#L14)

#### :gear: OnUploadAssetContextSchema

| Constant                     | Type                                                                                                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnUploadAssetContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L9)

#### :gear: OnDeleteAssetContextSchema

| Constant                     | Type                                                                                                                                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteAssetContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodOptional<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L21)

#### :gear: OnDeleteManyAssetsContextSchema

| Constant                          | Type                                                                                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteManyAssetsContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L35)

#### :gear: OnDeleteFilteredAssetsContextSchema

| Constant                              | Type                                                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteFilteredAssetsContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L47)

#### :gear: AssertUploadAssetContextSchema

| Constant                         | Type                                                                                                                                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertUploadAssetContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L61)

#### :gear: AssertDeleteAssetContextSchema

| Constant                         | Type                                                                                                                                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteAssetContextSchema` | `ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L73)

#### :gear: AssertSetDocSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, Z...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L44)

#### :gear: AssertDeleteDocSchema

| Constant                | Type                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteDocSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, Z...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L54)

#### :gear: AssertUploadAssetSchema

| Constant                  | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertUploadAssetSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, Z...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L64)

#### :gear: AssertDeleteAssetSchema

| Constant                  | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteAssetSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, Z...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L74)

#### :gear: AssertSchema

| Constant       | Type                                                                                                                                                                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSchema` | `ZodUnion<[ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { assert: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodU...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L84)

#### :gear: OnSetDocSchema

| Constant         | Type                                                                                                                                                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodU...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L54)

#### :gear: OnSetManyDocsSchema

| Constant              | Type                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetManyDocsSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodUn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L64)

#### :gear: OnDeleteDocSchema

| Constant            | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteDocSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodU...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L74)

#### :gear: OnDeleteManyDocsSchema

| Constant                 | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteManyDocsSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodUn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L84)

#### :gear: OnDeleteFilteredDocsSchema

| Constant                     | Type                                                                                                                                                                                                                                                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteFilteredDocsSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodUn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L94)

#### :gear: OnUploadAssetSchema

| Constant              | Type                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnUploadAssetSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodU...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L104)

#### :gear: OnDeleteAssetSchema

| Constant              | Type                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteAssetSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodOptional<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, Zo...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L114)

#### :gear: OnDeleteManyAssetsSchema

| Constant                   | Type                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteManyAssetsSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodUn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L124)

#### :gear: OnDeleteFilteredAssetsSchema

| Constant                       | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteFilteredAssetsSchema` | `ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodArray<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnknown>, ZodUn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L134)

#### :gear: HookSchema

| Constant     | Type                                                                                                                                                                                                                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookSchema` | `ZodUnion<[ZodObject<extendShape<{ collections: ZodReadonly<ZodArray<ZodString, "many">>; }, { run: ZodFunction<ZodTuple<[ZodObject<{ caller: ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<...>>; data: ZodObject<...>; }, "strict", ZodTypeAny, baseObjectOutputType<...>, baseObjectInputType<...>>], ZodUnkn...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L144)

#### :gear: ControllerScopeSchema

| Constant                | Type                          |
| ----------------------- | ----------------------------- |
| `ControllerScopeSchema` | `ZodEnum<["write", "admin"]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L15)

#### :gear: MetadataSchema

| Constant         | Type                                     |
| ---------------- | ---------------------------------------- |
| `MetadataSchema` | `ZodTuple<[ZodString, ZodString], null>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L25)

#### :gear: ControllerSchema

| Constant           | Type                                                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ControllerSchema` | `ZodObject<{ metadata: ZodArray<ZodTuple<[ZodString, ZodString], null>, "many">; created_at: ZodBigInt; updated_at: ZodBigInt; expires_at: ZodOptional<...>; scope: ZodEnum<...>; }, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L35)

#### :gear: ControllerRecordSchema

| Constant                 | Type                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `ControllerRecordSchema` | `ZodTuple<[ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>, ZodObject<...>], null>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L79)

#### :gear: ControllersSchema

| Constant            | Type                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `ControllersSchema` | `ZodArray<ZodTuple<[ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>, ZodObject<...>], null>, "many">` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L89)

#### :gear: ControllerCheckParamsSchema

| Constant                      | Type                                                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ControllerCheckParamsSchema` | `ZodObject<{ caller: ZodUnion<[ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>, ZodType<...>]>; controllers: ZodArray<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L99)

#### :gear: SetDocStoreParamsSchema

| Constant                  | Type                                                                                                                                                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocStoreParamsSchema` | `ZodObject<extendShape<{ caller: ZodUnion<[ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>, ZodType<...>]>; collection: ZodString; key: ZodString; }, { ...; }>, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L46)

#### :gear: DeleteDocStoreParamsSchema

| Constant                     | Type                                                                                                                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DeleteDocStoreParamsSchema` | `ZodObject<extendShape<{ caller: ZodUnion<[ZodType<Uint8Array<ArrayBufferLike>, ZodTypeDef, Uint8Array<ArrayBufferLike>>, ZodType<...>]>; collection: ZodString; key: ZodString; }, { ...; }>, "strict", ZodTypeAny, { ...; }, { ...; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L66)

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
- [SetDoc](#gear-setdoc)
- [DelDoc](#gear-deldoc)
- [DocUpsert](#gear-docupsert)
- [DocAssertSet](#gear-docassertset)
- [DocAssertDelete](#gear-docassertdelete)
- [DocContext](#gear-doccontext)
- [AssetKey](#gear-assetkey)
- [AssetEncoding](#gear-assetencoding)
- [Asset](#gear-asset)
- [Batch](#gear-batch)
- [CommitBatch](#gear-commitbatch)
- [AssetAssertUpload](#gear-assetassertupload)
- [Controller](#gear-controller)
- [ControllerCheckParams](#gear-controllercheckparams)
- [DocStoreParams](#gear-docstoreparams)
- [CallParams](#gear-callparams)

#### :gear: Collections

Defines the collections where a hook or assertion should run.

| Property      | Type                | Description                                                                                                        |
| ------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `collections` | `readonly string[]` | An array of collection names where the hook or assertion will run. If empty, no hooks or assertions are triggered. |

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

#### :gear: AssetKey

Metadata identifying an asset within a collection and the storage system.

| Property      | Type                          | Description                                                                                                                 |
| ------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `name`        | `string`                      | The name of the asset (e.g., "logo.png").                                                                                   |
| `full_path`   | `string`                      | The full relative path of the asset (e.g., "/images/logo.png").                                                             |
| `token`       | `string or undefined`         | Optional access token for the asset. If set, can be used using a query parameter e.g. /full_path/?token=1223-3345-5564-3333 |
| `collection`  | `string`                      | The collection to which this asset belongs.                                                                                 |
| `owner`       | `Uint8Array<ArrayBufferLike>` | The owner of the asset.                                                                                                     |
| `description` | `string or undefined`         | Optional description of the asset for indexing/search.                                                                      |

#### :gear: AssetEncoding

Represents a specific encoding of an asset, such as "gzip" or "identity" (no compression).

| Property         | Type          | Description                                     |
| ---------------- | ------------- | ----------------------------------------------- |
| `modified`       | `bigint`      | Timestamp when the encoding was last modified.  |
| `content_chunks` | `BlobOrKey[]` | Chunks of binary content or references to them. |
| `total_length`   | `bigint`      | Total byte size of the encoded content.         |
| `sha256`         | `Hash`        | SHA-256 hash of the encoded content.            |

#### :gear: Asset

A stored asset including its metadata, encodings, and timestamps.

| Property     | Type                            | Description                                                                                    |
| ------------ | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `key`        | `AssetKey`                      | Metadata about the asset's identity and ownership.                                             |
| `headers`    | `HeaderField[]`                 | Optional HTTP headers associated with the asset.                                               |
| `encodings`  | `Record<string, AssetEncoding>` | A mapping from encoding types (e.g., "identity", "gzip") to the corresponding encoded version. |
| `created_at` | `bigint`                        | Timestamp when the asset was created.                                                          |
| `updated_at` | `bigint`                        | Timestamp when the asset was last updated.                                                     |
| `version`    | `bigint or undefined`           | Optional version number of the asset.                                                          |

#### :gear: Batch

Represents a batch of chunks to be uploaded and committed to an asset.

| Property        | Type                  | Description                                       |
| --------------- | --------------------- | ------------------------------------------------- |
| `key`           | `AssetKey`            | The metadata key for the asset being uploaded.    |
| `reference_id`  | `bigint or undefined` | Optional reference ID for tracking or validation. |
| `expires_at`    | `bigint`              | Timestamp when this batch expires.                |
| `encoding_type` | `string or undefined` | Optional encoding format (e.g., "gzip").          |

#### :gear: CommitBatch

Represents the final step in uploading an asset, committing the batch to storage.

| Property    | Type            | Description                                       |
| ----------- | --------------- | ------------------------------------------------- |
| `batch_id`  | `bigint`        | The ID of the batch being committed.              |
| `headers`   | `HeaderField[]` | HTTP headers associated with this asset.          |
| `chunk_ids` | `bigint[]`      | List of chunk IDs that make up the asset content. |

#### :gear: AssetAssertUpload

Represents a validation context before uploading an asset.

| Property       | Type                 | Description                                       |
| -------------- | -------------------- | ------------------------------------------------- |
| `current`      | `Asset or undefined` | The current asset already stored (if any).        |
| `batch`        | `Batch`              | The batch metadata being uploaded.                |
| `commit_batch` | `CommitBatch`        | The commit data describing headers and chunk ids. |

#### :gear: Controller

Represents a controller with access scope and associated metadata.

| Property     | Type                  | Description                                                                                        |
| ------------ | --------------------- | -------------------------------------------------------------------------------------------------- |
| `metadata`   | `[string, string][]`  | A list of key-value metadata pairs associated with the controller.                                 |
| `created_at` | `bigint`              | The timestamp when the controller was created.                                                     |
| `updated_at` | `bigint`              | The timestamp when the controller was last updated.                                                |
| `expires_at` | `bigint or undefined` | Optional expiration timestamp for the controller. 👉 It's a placeholder for future implementation. |
| `scope`      | `"write" or "admin"`  | The scope assigned to the controller.                                                              |

#### :gear: ControllerCheckParams

Represents the parameters required to perform controller checks.

| Property      | Type                                                                                                                                                                      | Description                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `caller`      | `Uint8Array<ArrayBufferLike> or Principal`                                                                                                                                | The identity of the caller to verify against the controller list. |
| `controllers` | `[Uint8Array<ArrayBufferLike>, { created_at: bigint; updated_at: bigint; metadata: [string, string][]; scope: "write" or "admin"; expires_at?: bigint or undefined; }][]` | The list of controllers to check against.                         |

#### :gear: DocStoreParams

Represents the base parameters required to access the datastore and modify a document.

| Property     | Type                                       | Description                                                    |
| ------------ | ------------------------------------------ | -------------------------------------------------------------- |
| `caller`     | `Uint8Array<ArrayBufferLike> or Principal` | The caller who initiate the document operation.                |
| `collection` | `string`                                   | The name of the collection where the document is stored.       |
| `key`        | `string`                                   | The unique key identifying the document within the collection. |

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
- [Description](#gear-description)
- [AssertFunction](#gear-assertfunction)
- [RunFunction](#gear-runfunction)
- [RawData](#gear-rawdata)
- [OptionDoc](#gear-optiondoc)
- [OnSetDocContext](#gear-onsetdoccontext)
- [OnSetManyDocsContext](#gear-onsetmanydocscontext)
- [OnDeleteDocContext](#gear-ondeletedoccontext)
- [OnDeleteManyDocsContext](#gear-ondeletemanydocscontext)
- [OnDeleteFilteredDocsContext](#gear-ondeletefiltereddocscontext)
- [AssertSetDocContext](#gear-assertsetdoccontext)
- [AssertDeleteDocContext](#gear-assertdeletedoccontext)
- [SatelliteEnv](#gear-satelliteenv)
- [HeaderField](#gear-headerfield)
- [Blob](#gear-blob)
- [BlobOrKey](#gear-bloborkey)
- [Hash](#gear-hash)
- [EncodingType](#gear-encodingtype)
- [ReferenceId](#gear-referenceid)
- [ChunkId](#gear-chunkid)
- [BatchId](#gear-batchid)
- [OnUploadAssetContext](#gear-onuploadassetcontext)
- [OnDeleteAssetContext](#gear-ondeleteassetcontext)
- [OnDeleteManyAssetsContext](#gear-ondeletemanyassetscontext)
- [OnDeleteFilteredAssetsContext](#gear-ondeletefilteredassetscontext)
- [AssertUploadAssetContext](#gear-assertuploadassetcontext)
- [AssertDeleteAssetContext](#gear-assertdeleteassetcontext)
- [OnAssert](#gear-onassert)
- [AssertSetDoc](#gear-assertsetdoc)
- [AssertDeleteDoc](#gear-assertdeletedoc)
- [AssertUploadAsset](#gear-assertuploadasset)
- [AssertDeleteAsset](#gear-assertdeleteasset)
- [Assert](#gear-assert)
- [AssertFn](#gear-assertfn)
- [AssertFnOrObject](#gear-assertfnorobject)
- [OnHook](#gear-onhook)
- [OnSetDoc](#gear-onsetdoc)
- [OnSetManyDocs](#gear-onsetmanydocs)
- [OnDeleteDoc](#gear-ondeletedoc)
- [OnDeleteManyDocs](#gear-ondeletemanydocs)
- [OnDeleteFilteredDocs](#gear-ondeletefiltereddocs)
- [OnUploadAsset](#gear-onuploadasset)
- [OnDeleteAsset](#gear-ondeleteasset)
- [OnDeleteManyAssets](#gear-ondeletemanyassets)
- [OnDeleteFilteredAssets](#gear-ondeletefilteredassets)
- [Hook](#gear-hook)
- [HookFn](#gear-hookfn)
- [HookFnOrObject](#gear-hookfnorobject)
- [ControllerScope](#gear-controllerscope)
- [Metadata](#gear-metadata)
- [ControllerRecord](#gear-controllerrecord)
- [Controllers](#gear-controllers)
- [SetDocStoreParams](#gear-setdocstoreparams)
- [DeleteDocStoreParams](#gear-deletedocstoreparams)
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

#### :gear: Description

Represents a description with a maximum length of 1024 characters.
Used for document and asset fields which can be useful for search purpose.

| Type          | Type                                |
| ------------- | ----------------------------------- |
| `Description` | `z.infer<typeof DescriptionSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L81)

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

#### :gear: RawData

Represents raw binary data.

This is used to store structured data in a document.

| Type      | Type                               |
| --------- | ---------------------------------- |
| `RawData` | `z.infer<typeof Uint8ArraySchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L24)

#### :gear: OptionDoc

A shorthand for a document that might or not be defined.

| Type        | Type               |
| ----------- | ------------------ |
| `OptionDoc` | `Doc or undefined` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L84)

#### :gear: OnSetDocContext

The context provided to the `onSetDoc` hook.

This context contains information about the document being created or updated,
along with details about the user who triggered the operation.

| Type              | Type                                 |
| ----------------- | ------------------------------------ |
| `OnSetDocContext` | `HookContext<DocContext<DocUpsert>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L68)

#### :gear: OnSetManyDocsContext

The context provided to the `onSetManyDocs` hook.

This context contains information about multiple documents being created or updated
in a single operation, along with details about the user who triggered it.

| Type                   | Type                                   |
| ---------------------- | -------------------------------------- |
| `OnSetManyDocsContext` | `HookContext<DocContext<DocUpsert>[]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L83)

#### :gear: OnDeleteDocContext

The context provided to the `onDeleteDoc` hook.

This context contains information about a single document being deleted,
along with details about the user who triggered the operation.

| Type                 | Type                                 |
| -------------------- | ------------------------------------ |
| `OnDeleteDocContext` | `HookContext<DocContext<OptionDoc>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L96)

#### :gear: OnDeleteManyDocsContext

The context provided to the `onDeleteManyDocs` hook.

This context contains information about multiple documents being deleted,
along with details about the user who triggered the operation.

| Type                      | Type                                   |
| ------------------------- | -------------------------------------- |
| `OnDeleteManyDocsContext` | `HookContext<DocContext<OptionDoc>[]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L111)

#### :gear: OnDeleteFilteredDocsContext

The context provided to the `onDeleteFilteredDocs` hook.

This context contains information about documents deleted as a result of a filter,
along with details about the user who triggered the operation.

| Type                          | Type                                   |
| ----------------------------- | -------------------------------------- |
| `OnDeleteFilteredDocsContext` | `HookContext<DocContext<OptionDoc>[]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L126)

#### :gear: AssertSetDocContext

The context provided to the `assertDeleteDoc` hook.

This context contains information about the document being validated before
it is created or updated. If validation fails, the developer should throw an error.

| Type                  | Type                                    |
| --------------------- | --------------------------------------- |
| `AssertSetDocContext` | `HookContext<DocContext<DocAssertSet>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L139)

#### :gear: AssertDeleteDocContext

The context provided to the `assertDeleteDoc` hook.

This context contains information about the document being validated before
it is deleted. If validation fails, the developer should throw an error.

| Type                     | Type                                       |
| ------------------------ | ------------------------------------------ |
| `AssertDeleteDocContext` | `HookContext<DocContext<DocAssertDelete>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L154)

#### :gear: SatelliteEnv

Placeholder for future environment-specific configurations.

Currently unused, but it may support features such as:

- Defining the execution mode (e.g., staging or production).
- Providing environment-specific values like `ckBtcLedgerId` for test or production.

| Type           | Type                                 |
| -------------- | ------------------------------------ |
| `SatelliteEnv` | `z.infer<typeof SatelliteEnvSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/satellite.env.ts#L15)

#### :gear: HeaderField

Represents a single HTTP header as a tuple of name and value.

| Type          | Type               |
| ------------- | ------------------ |
| `HeaderField` | `[string, string]` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L24)

#### :gear: Blob

Binary content used in asset encoding.

| Type   | Type         |
| ------ | ------------ |
| `Blob` | `Uint8Array` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L34)

#### :gear: BlobOrKey

When stable memory is used, chunks are saved within a StableBTreeMap and their keys - StableEncodingChunkKey - are saved for reference as serialized values

| Type        | Type         |
| ----------- | ------------ |
| `BlobOrKey` | `Uint8Array` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L44)

#### :gear: Hash

Represents a SHA-256 hash as a 32-byte binary value.

| Type   | Type         |
| ------ | ------------ |
| `Hash` | `Uint8Array` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L56)

#### :gear: EncodingType

A string identifier representing a specific encoding format (e.g., "gzip", "identity").

| Type           | Type |
| -------------- | ---- |
| `EncodingType` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L198)

#### :gear: ReferenceId

A unique reference identifier for batches.

| Type          | Type |
| ------------- | ---- |
| `ReferenceId` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L208)

#### :gear: ChunkId

A unique identifier representing a single chunk of data.

| Type      | Type |
| --------- | ---- |
| `ChunkId` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L255)

#### :gear: BatchId

A unique identifier representing a batch of upload.

| Type      | Type |
| --------- | ---- |
| `BatchId` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L265)

#### :gear: OnUploadAssetContext

Context for the `onUploadAsset` hook.

This context contains information about the asset that was uploaded.

| Type                   | Type                 |
| ---------------------- | -------------------- |
| `OnUploadAssetContext` | `HookContext<Asset>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L16)

#### :gear: OnDeleteAssetContext

Context for the `onDeleteAsset` hook.

This context contains information about a single asset being deleted, along with details about the user who triggered the operation.

If undefined, the asset did not exist.

| Type                   | Type                              |
| ---------------------- | --------------------------------- |
| `OnDeleteAssetContext` | `HookContext<Asset or undefined>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L30)

#### :gear: OnDeleteManyAssetsContext

Context for the `onDeleteManyAssets` hook.

This context contains information about multiple assets being potentially deleted, along with details about the user who triggered the operation.

| Type                        | Type                                     |
| --------------------------- | ---------------------------------------- |
| `OnDeleteManyAssetsContext` | `HookContext<Array<Asset or undefined>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L42)

#### :gear: OnDeleteFilteredAssetsContext

Context for the `onDeleteFilteredAssets` hook.

This context contains information about documents deleted as a result of a filter, along with details about the user who triggered the operation.

| Type                            | Type                                     |
| ------------------------------- | ---------------------------------------- |
| `OnDeleteFilteredAssetsContext` | `HookContext<Array<Asset or undefined>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L56)

#### :gear: AssertUploadAssetContext

Context for the `assertUploadAsset` hook.

This context contains information about the asset being validated before it is uploaded. If validation fails, the developer should throw an error.

| Type                       | Type                             |
| -------------------------- | -------------------------------- |
| `AssertUploadAssetContext` | `HookContext<AssetAssertUpload>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L68)

#### :gear: AssertDeleteAssetContext

Context for the `assertDeleteAsset` hook.

This context contains information about the asset being validated before it is deleted. If validation fails, the developer should throw an error.

| Type                       | Type                 |
| -------------------------- | -------------------- |
| `AssertDeleteAssetContext` | `HookContext<Asset>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L80)

#### :gear: OnAssert

A generic schema for defining assertions related to collections.

| Type       | Type                                             |
| ---------- | ------------------------------------------------ |
| `OnAssert` | `Collections and { assert: AssertFunction<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L37)

#### :gear: AssertSetDoc

An assertion that runs when a document is created or updated.

| Type           | Type                            |
| -------------- | ------------------------------- |
| `AssertSetDoc` | `OnAssert<AssertSetDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L49)

#### :gear: AssertDeleteDoc

An assertion that runs when a document is deleted.

| Type              | Type                               |
| ----------------- | ---------------------------------- |
| `AssertDeleteDoc` | `OnAssert<AssertDeleteDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L59)

#### :gear: AssertUploadAsset

An assertion that runs before an asset is uploaded.

| Type                | Type                                 |
| ------------------- | ------------------------------------ |
| `AssertUploadAsset` | `OnAssert<AssertUploadAssetContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L69)

#### :gear: AssertDeleteAsset

An assertion that runs before an asset is deleted.

| Type                | Type                                 |
| ------------------- | ------------------------------------ |
| `AssertDeleteAsset` | `OnAssert<AssertDeleteAssetContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L79)

#### :gear: Assert

All assertions definitions.

| Type     | Type                                                                        |
| -------- | --------------------------------------------------------------------------- |
| `Assert` | `AssertSetDoc or AssertDeleteDoc or AssertUploadAsset or AssertDeleteAsset` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L94)

#### :gear: AssertFn

| Type       | Type                                                |
| ---------- | --------------------------------------------------- |
| `AssertFn` | `(assert: z.infer<typeof SatelliteEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L98)

#### :gear: AssertFnOrObject

| Type               | Type               |
| ------------------ | ------------------ |
| `AssertFnOrObject` | `T or AssertFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L102)

#### :gear: OnHook

A generic schema for defining hooks related to collections.

| Type     | Type                                                                                                                                                                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnHook` | `Collections and { /** * A function that runs when the hook is triggered for the specified collections. * * @param {T} context - Contains information about the affected document(s). * @returns {Promise<void>} Resolves when the operation completes. */ run: RunFunction<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L41)

#### :gear: OnSetDoc

A hook that runs when a document is created or updated.

| Type       | Type                      |
| ---------- | ------------------------- |
| `OnSetDoc` | `OnHook<OnSetDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L59)

#### :gear: OnSetManyDocs

A hook that runs when multiple documents are created or updated.

| Type            | Type                           |
| --------------- | ------------------------------ |
| `OnSetManyDocs` | `OnHook<OnSetManyDocsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L69)

#### :gear: OnDeleteDoc

A hook that runs when a single document is deleted.

| Type          | Type                         |
| ------------- | ---------------------------- |
| `OnDeleteDoc` | `OnHook<OnDeleteDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L79)

#### :gear: OnDeleteManyDocs

A hook that runs when multiple documents are deleted.

| Type               | Type                              |
| ------------------ | --------------------------------- |
| `OnDeleteManyDocs` | `OnHook<OnDeleteManyDocsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L89)

#### :gear: OnDeleteFilteredDocs

A hook that runs when a filtered set of documents is deleted based on query conditions.

| Type                   | Type                                  |
| ---------------------- | ------------------------------------- |
| `OnDeleteFilteredDocs` | `OnHook<OnDeleteFilteredDocsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L99)

#### :gear: OnUploadAsset

A hook that runs when a single asset is uploaded.

| Type            | Type                           |
| --------------- | ------------------------------ |
| `OnUploadAsset` | `OnHook<OnUploadAssetContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L109)

#### :gear: OnDeleteAsset

A hook that runs when a single asset is potentially deleted.

| Type            | Type                           |
| --------------- | ------------------------------ |
| `OnDeleteAsset` | `OnHook<OnDeleteAssetContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L119)

#### :gear: OnDeleteManyAssets

A hook that runs when multiple assets are potentially deleted.

| Type                 | Type                                |
| -------------------- | ----------------------------------- |
| `OnDeleteManyAssets` | `OnHook<OnDeleteManyAssetsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L129)

#### :gear: OnDeleteFilteredAssets

A hook that runs when a filtered set of assets is deleted based on query conditions.

| Type                     | Type                                    |
| ------------------------ | --------------------------------------- |
| `OnDeleteFilteredAssets` | `OnHook<OnDeleteFilteredAssetsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L139)

#### :gear: Hook

All hooks definitions.

| Type   | Type |
| ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hook` | `    | OnSetDoc or OnSetManyDocs or OnDeleteDoc or OnDeleteManyDocs or OnDeleteFilteredDocs or OnUploadAsset or OnDeleteAsset or OnDeleteManyAssets or OnDeleteFilteredAssets` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L159)

#### :gear: HookFn

| Type     | Type                                              |
| -------- | ------------------------------------------------- |
| `HookFn` | `(hook: z.infer<typeof SatelliteEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L172)

#### :gear: HookFnOrObject

| Type             | Type             |
| ---------------- | ---------------- |
| `HookFnOrObject` | `T or HookFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L176)

#### :gear: ControllerScope

Represents the permission scope of a controller.

| Type              | Type                                    |
| ----------------- | --------------------------------------- |
| `ControllerScope` | `z.infer<typeof ControllerScopeSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L20)

#### :gear: Metadata

Represents a single metadata entry as a key-value tuple.

| Type       | Type                             |
| ---------- | -------------------------------- |
| `Metadata` | `z.infer<typeof MetadataSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L30)

#### :gear: ControllerRecord

Represents a tuple containing the principal ID and associated controller data.

| Type               | Type                                     |
| ------------------ | ---------------------------------------- |
| `ControllerRecord` | `z.infer<typeof ControllerRecordSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L84)

#### :gear: Controllers

Represents a list of controllers.

| Type          | Type                                |
| ------------- | ----------------------------------- |
| `Controllers` | `z.infer<typeof ControllersSchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L94)

#### :gear: SetDocStoreParams

Represents the parameters required to store or update a document.

This includes the document data along with metadata such as the caller,
collection, and key.

| Type                | Type                                                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocStoreParams` | `DocStoreParams and { /** * The data, optional description and version required to create or update a document. */ doc: SetDoc; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L56)

#### :gear: DeleteDocStoreParams

Represents the parameters required to delete a document.

This includes the document version along with metadata such as the caller,
collection, and key.

| Type                   | Type                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `DeleteDocStoreParams` | `DocStoreParams and { /** * The version required to delete a document. */ doc: DelDoc; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L76)

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
