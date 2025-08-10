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

- [createFunctionSchema](#gear-createfunctionschema)
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
- [createListResultsSchema](#gear-createlistresultsschema)
- [normalizeCaller](#gear-normalizecaller)
- [getAdminControllers](#gear-getadmincontrollers)
- [getControllers](#gear-getcontrollers)
- [isAdminController](#gear-isadmincontroller)
- [isController](#gear-iscontroller)
- [setDocStore](#gear-setdocstore)
- [deleteDocStore](#gear-deletedocstore)
- [getDocStore](#gear-getdocstore)
- [listDocsStore](#gear-listdocsstore)
- [countCollectionDocsStore](#gear-countcollectiondocsstore)
- [countDocsStore](#gear-countdocsstore)
- [deleteDocsStore](#gear-deletedocsstore)
- [deleteFilteredDocsStore](#gear-deletefiltereddocsstore)
- [decodeDocData](#gear-decodedocdata)
- [encodeDocData](#gear-encodedocdata)
- [countCollectionAssetsStore](#gear-countcollectionassetsstore)
- [countAssetsStore](#gear-countassetsstore)
- [setAssetHandler](#gear-setassethandler)
- [deleteAssetStore](#gear-deleteassetstore)
- [deleteAssetsStore](#gear-deleteassetsstore)
- [deleteFilteredAssetsStore](#gear-deletefilteredassetsstore)
- [getAssetStore](#gear-getassetstore)
- [listAssetsStore](#gear-listassetsstore)
- [getContentChunksStore](#gear-getcontentchunksstore)
- [call](#gear-call)
- [id](#gear-id)
- [time](#gear-time)

#### :gear: createFunctionSchema

| Function               | Type                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `createFunctionSchema` | `<T extends z.core.$ZodFunction>(schema: T) => ZodCustom<Parameters<T["implement"]>[0], Parameters<T["implement"]>[0]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/utils/zod.utils.ts#L4)

#### :gear: HookContextSchema

| Function            | Type                                                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookContextSchema` | `<T extends z.ZodTypeAny>(dataSchema: T) => ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: T; }, $strict>` |

References:

- HookContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L8)

#### :gear: AssertFunctionSchema

| Function               | Type                                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertFunctionSchema` | `<T extends z.ZodTypeAny>(contextSchema: T) => ZodCustom<$InferInnerFunctionType<ZodTuple<[T], null>, ZodVoid>, $InferInnerFunctionType<ZodTuple<[T], null>, ZodVoid>>` |

References:

- AssertFunction

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L37)

#### :gear: RunFunctionSchema

| Function            | Type                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RunFunctionSchema` | `<T extends z.ZodTypeAny>(contextSchema: T) => ZodCustom<$InferInnerFunctionType<ZodTuple<[T], null>, ZodUnion<[ZodPromise<ZodVoid>, ZodVoid]>>, $InferInnerFunctionType<...>>` |

References:

- RunFunction

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L52)

#### :gear: DocContextSchema

| Function           | Type                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `DocContextSchema` | `<T extends z.ZodTypeAny>(dataSchema: T) => ZodObject<{ collection: ZodString; key: ZodString; data: T; }, $strict>` |

References:

- DocContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L17)

#### :gear: AssertFnSchema

| Function         | Type                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `AssertFnSchema` | `<T extends z.ZodTypeAny>(assertSchema: T) => $ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodString>], null>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L97)

#### :gear: AssertFnOrObjectSchema

| Function                 | Type                                                                                                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertFnOrObjectSchema` | `<T extends z.ZodTypeAny>(assertSchema: T) => ZodUnion<readonly [T, ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodRecord<ZodString, ZodString>], null>, T>, $InferInnerFunctionType<...>>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L104)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L108)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L109)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L110)

#### :gear: defineAssert

| Function       | Type                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineAssert` | `{ <T extends Assert>(assert: T): T; <T extends Assert>(assert: AssertFn<T>): AssertFn<T>; <T extends Assert>(assert: AssertFnOrObject<T>): AssertFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L111)

#### :gear: HookFnSchema

| Function       | Type                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| `HookFnSchema` | `<T extends z.ZodTypeAny>(hookSchema: T) => $ZodFunction<ZodTuple<[ZodRecord<ZodString, ZodString>], null>, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L171)

#### :gear: HookFnOrObjectSchema

| Function               | Type                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookFnOrObjectSchema` | `<T extends z.ZodTypeAny>(hookSchema: T) => ZodUnion<readonly [T, ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodRecord<ZodString, ZodString>], null>, T>, $InferInnerFunctionType<...>>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L175)

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

#### :gear: defineHook

| Function     | Type                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineHook` | `{ <T extends Hook>(hook: T): T; <T extends Hook>(hook: HookFn<T>): HookFn<T>; <T extends Hook>(hook: HookFnOrObject<T>): HookFnOrObject<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L182)

#### :gear: createListResultsSchema

Represents a list result.

| Function                  | Type                                                                                                                                                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createListResultsSchema` | `<T extends z.ZodTypeAny>(itemData: T) => ZodObject<{ items: ZodArray<ZodTuple<[ZodString, T], null>>; items_length: ZodBigInt; items_page: ZodOptional<ZodBigInt>; matches_length: ZodBigInt; matches_pages: ZodOptional<...>; }, $strict>` |

References:

- JsListResults

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L128)

#### :gear: normalizeCaller

Normalizes a user ID into a raw `Uint8Array` representation.

| Function          | Type                                                                                |
| ----------------- | ----------------------------------------------------------------------------------- |
| `normalizeCaller` | `(caller: Uint8Array<ArrayBufferLike> or Principal) => Uint8Array<ArrayBufferLike>` |

Parameters:

- `caller`: - The caller identity, either a raw `Uint8Array`
  or a `Principal` instance.

Returns:

The raw user ID as a `Uint8Array`.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/utils/caller.utils.ts#L12)

#### :gear: getAdminControllers

Gets the list of admin controllers from the Satellite.

| Function              | Type                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getAdminControllers` | `() => [Uint8Array<ArrayBufferLike>, { metadata: [string, string][]; created_at: bigint; updated_at: bigint; scope: "write" or "admin" or "submit"; expires_at?: bigint or undefined; }][]` |

Returns:

The list of admin controllers.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/controllers.sdk.ts#L15)

#### :gear: getControllers

Gets the list of controllers from the Satellite.

| Function         | Type                                                                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getControllers` | `() => [Uint8Array<ArrayBufferLike>, { metadata: [string, string][]; created_at: bigint; updated_at: bigint; scope: "write" or "admin" or "submit"; expires_at?: bigint or undefined; }][]` |

Returns:

The list of all controllers.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/controllers.sdk.ts#L24)

#### :gear: isAdminController

Checks if the given caller is an admin among the provided controllers.

| Function            | Type                                         |
| ------------------- | -------------------------------------------- |
| `isAdminController` | `(params: ControllerCheckParams) => boolean` |

Parameters:

- `params`: - The parameters including the caller identity
  and the list of controllers to verify against.

Returns:

Whether the caller is an admin.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/controllers.sdk.ts#L36)

#### :gear: isController

Checks if the given caller exists among the provided controllers.

| Function       | Type                                         |
| -------------- | -------------------------------------------- |
| `isController` | `(params: ControllerCheckParams) => boolean` |

Parameters:

- `params`: - The parameters including the caller identity
  and the list of controllers to verify against.

Returns:

Whether the caller is a controller.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/controllers.sdk.ts#L56)

#### :gear: setDocStore

Stores or updates a document in the datastore.

The data must have been encoded - using encodeDocData - before calling this function.

| Function      | Type                                                   |
| ------------- | ------------------------------------------------------ |
| `setDocStore` | `(params: SetDocStoreParams) => DocContext<DocUpsert>` |

Parameters:

- `params`: - The parameters required to store the document,
  including the caller, collection, key, and document data.

Returns:

The context of the stored or updated document,
including its key, collection, and both the previous and current versions of the document.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L39)

#### :gear: deleteDocStore

Deletes a document from the datastore.

| Function         | Type                                                      |
| ---------------- | --------------------------------------------------------- |
| `deleteDocStore` | `(params: DeleteDocStoreParams) => DocContext<OptionDoc>` |

Parameters:

- `params`: - The parameters required to delete the document,
  including the caller, collection, key, and the expected version of the document.

Returns:

The context of the deleted document,
including its key, collection, and optionally the previous document data if it existed.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L61)

#### :gear: getDocStore

Retrieve a document from the datastore.

| Function      | Type                                       |
| ------------- | ------------------------------------------ |
| `getDocStore` | `(params: GetDocStoreParams) => OptionDoc` |

Parameters:

- `params`: - The parameters required to get the document.

Returns:

The document if found, or undefined if not.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L81)

#### :gear: listDocsStore

Lists documents from the datastore using optional filtering, pagination, and ordering parameters.

| Function        | Type                                            |
| --------------- | ----------------------------------------------- |
| `listDocsStore` | `(params: ListStoreParams) => ListResults<Doc>` |

Parameters:

- `params`: - The parameters required to perform the list operation.

Returns:

A list result containing matching documents and pagination metadata.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L101)

#### :gear: countCollectionDocsStore

Counts the number of documents in a specific collection.

| Function                   | Type                                   |
| -------------------------- | -------------------------------------- |
| `countCollectionDocsStore` | `(params: CollectionParams) => bigint` |

Parameters:

- `params`: - The parameters required to count documents in the collection.

Returns:

The total number of documents in the specified collection.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L121)

#### :gear: countDocsStore

Counts the number of documents in a collection matching specific filters and owned by a specific caller.

| Function         | Type                                  |
| ---------------- | ------------------------------------- |
| `countDocsStore` | `(params: ListStoreParams) => bigint` |

Parameters:

- `params`: - The parameters required to perform the filtered count.

Returns:

The number of documents that match the provided filters.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L139)

#### :gear: deleteDocsStore

Delete documents in a specific collection of the Datastore.

| Function          | Type                                 |
| ----------------- | ------------------------------------ |
| `deleteDocsStore` | `(params: CollectionParams) => void` |

Parameters:

- `params`: - The parameters required to delete documents in the collection.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L157)

#### :gear: deleteFilteredDocsStore

Delete documents in a collection matching specific filters and owned by a specific caller.

| Function                  | Type                                                   |
| ------------------------- | ------------------------------------------------------ |
| `deleteFilteredDocsStore` | `(params: ListStoreParams) => DocContext<OptionDoc>[]` |

Parameters:

- `params`: - The parameters required to perform the filtered deletion.

Returns:

The context resulting of the deletion of documents that match the provided filters.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/db.sdk.ts#L175)

#### :gear: decodeDocData

Decodes the raw data of a document into a JavaScript object.

| Function        | Type                                          |
| --------------- | --------------------------------------------- |
| `decodeDocData` | `<T>(data: Uint8Array<ArrayBufferLike>) => T` |

Parameters:

- `data`: - The raw data to be decoded.

Returns:

The parsed JavaScript object.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/serializer.sdk.ts#L11)

#### :gear: encodeDocData

Encodes a JavaScript object into a raw data format to be applied to a document.

| Function        | Type                                          |
| --------------- | --------------------------------------------- |
| `encodeDocData` | `<T>(data: T) => Uint8Array<ArrayBufferLike>` |

Parameters:

- `data`: - The data to be encoded.

Returns:

The serialized raw data.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/serializer.sdk.ts#L21)

#### :gear: countCollectionAssetsStore

Counts the number of assets in a specific collection.

| Function                     | Type                                   |
| ---------------------------- | -------------------------------------- |
| `countCollectionAssetsStore` | `(params: CollectionParams) => bigint` |

Parameters:

- `params`: - The parameters required to count assets in the collection.

Returns:

The total number of assets in the specified collection.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L35)

#### :gear: countAssetsStore

Counts the number of assets in a collection matching specific filters and owned by a specific caller.

| Function           | Type                                  |
| ------------------ | ------------------------------------- |
| `countAssetsStore` | `(params: ListStoreParams) => bigint` |

Parameters:

- `params`: - The parameters required to perform the filtered count.

Returns:

The number of assets that match the provided filters.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L53)

#### :gear: setAssetHandler

Sets or updates an asset in the storage.

| Function          | Type                                      |
| ----------------- | ----------------------------------------- |
| `setAssetHandler` | `(params: SetAssetHandlerParams) => void` |

Parameters:

- `params`: - The parameters required to set or update an asset.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L71)

#### :gear: deleteAssetStore

Deletes an asset from the storage.

| Function           | Type                                           |
| ------------------ | ---------------------------------------------- |
| `deleteAssetStore` | `(params: GetAssetStoreParams) => OptionAsset` |

Parameters:

- `params`: - The parameters required to delete the asset.

Returns:

The potentially deleted asset.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L89)

#### :gear: deleteAssetsStore

Delete assets in a specific collection of the Storage.

| Function            | Type                                 |
| ------------------- | ------------------------------------ |
| `deleteAssetsStore` | `(params: CollectionParams) => void` |

Parameters:

- `params`: - The parameters required to delete assets in the collection.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L107)

#### :gear: deleteFilteredAssetsStore

Delete assets in a collection matching specific filters and owned by a specific caller.

| Function                    | Type                                         |
| --------------------------- | -------------------------------------------- |
| `deleteFilteredAssetsStore` | `(params: ListStoreParams) => OptionAsset[]` |

Parameters:

- `params`: - The parameters required to perform the filtered deletion.

Returns:

The potential asset resulting of the deletion that match the provided filters.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L125)

#### :gear: getAssetStore

Retrieve an asset from the storage.

| Function        | Type                                           |
| --------------- | ---------------------------------------------- |
| `getAssetStore` | `(params: GetAssetStoreParams) => OptionAsset` |

Parameters:

- `params`: - The parameters required to get the asset.

Returns:

The asset if found, or undefined if not.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L147)

#### :gear: listAssetsStore

Lists assets (without content) from the storage using optional filtering, pagination, and ordering parameters.

| Function          | Type                                                       |
| ----------------- | ---------------------------------------------------------- |
| `listAssetsStore` | `(params: ListStoreParams) => ListResults<AssetNoContent>` |

Parameters:

- `params`: - The parameters required to perform the list operation.

Returns:

A list result containing matching assets and pagination metadata.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L167)

#### :gear: getContentChunksStore

Retrieves content chunks of an asset.

This function fetches a content chunk of a given asset encoding using the specified parameters.

| Function                | Type                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `getContentChunksStore` | `(params: GetContentChunksStoreParams) => Blob or undefined` |

Parameters:

- `params`: - The parameters including encoding, chunk index, and memory type.

Returns:

The content chunk if found, or `undefined` if not.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/storage.sdk.ts#L189)

#### :gear: call

Makes an asynchronous call to a canister on the Internet Computer.

This function encodes the provided arguments using Candid, performs the canister call,
and decodes the response based on the expected result types.

| Function | Type                                    |
| -------- | --------------------------------------- |
| `call`   | `<T>(params: CallParams) => Promise<T>` |

Parameters:

- `params`: - The parameters required for the canister call

Returns:

A promise resolving to the decoded result of the call.
Returns `undefined` if the canister response is empty.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/call.ic-cdk.ts#L20)

#### :gear: id

Retrieves the Satellite's Principal ID.

This function is a JavaScript binding for the Rust function
[`ic_cdk::id()`](https://docs.rs/ic-cdk/latest/ic_cdk/fn.id.html), which returns
the Principal of the executing canister.

| Function | Type              |
| -------- | ----------------- |
| `id`     | `() => Principal` |

Returns:

The Principal ID of the Satellite.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/id.ic-cdk.ts#L12)

#### :gear: time

Gets current timestamp, in nanoseconds since the epoch (1970-01-01)

This function is a JavaScript binding for the Rust function
[`ic_cdk::time()`](https://docs.rs/ic-cdk/latest/ic_cdk/api/fn.time.html), which returns
the system time publicly exposed and verified part of the IC state tree

| Function | Type           |
| -------- | -------------- |
| `time`   | `() => bigint` |

Returns:

The current timestamp.

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/time.ic-cdk.ts#L10)

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
- [HeaderFieldsSchema](#gear-headerfieldsschema)
- [BlobSchema](#gear-blobschema)
- [AssetKeySchema](#gear-assetkeyschema)
- [AssetEncodingSchema](#gear-assetencodingschema)
- [AssetSchema](#gear-assetschema)
- [AssetNoContentSchema](#gear-assetnocontentschema)
- [BatchSchema](#gear-batchschema)
- [CommitBatchSchema](#gear-commitbatchschema)
- [FullPathSchema](#gear-fullpathschema)
- [OptionAssetSchema](#gear-optionassetschema)
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
- [TimestampMatcherSchema](#gear-timestampmatcherschema)
- [ListMatcherSchema](#gear-listmatcherschema)
- [ListPaginateSchema](#gear-listpaginateschema)
- [ListOrderFieldSchema](#gear-listorderfieldschema)
- [ListOrderSchema](#gear-listorderschema)
- [ListParamsSchema](#gear-listparamsschema)
- [ControllerScopeSchema](#gear-controllerscopeschema)
- [MetadataSchema](#gear-metadataschema)
- [ControllerSchema](#gear-controllerschema)
- [ControllerRecordSchema](#gear-controllerrecordschema)
- [ControllersSchema](#gear-controllersschema)
- [ControllerCheckParamsSchema](#gear-controllercheckparamsschema)
- [CollectionParamsSchema](#gear-collectionparamsschema)
- [ListStoreParamsSchema](#gear-liststoreparamsschema)
- [GetDocStoreParamsSchema](#gear-getdocstoreparamsschema)
- [SetDocStoreParamsSchema](#gear-setdocstoreparamsschema)
- [DeleteDocStoreParamsSchema](#gear-deletedocstoreparamsschema)
- [CountCollectionDocsStoreParamsSchema](#gear-countcollectiondocsstoreparamsschema)
- [CountDocsStoreParamsSchema](#gear-countdocsstoreparamsschema)
- [ListDocsStoreParamsSchema](#gear-listdocsstoreparamsschema)
- [DeleteDocsStoreParamsSchema](#gear-deletedocsstoreparamsschema)
- [DeleteFilteredDocsStoreParamsSchema](#gear-deletefiltereddocsstoreparamsschema)
- [MemorySchema](#gear-memoryschema)
- [GetAssetStoreParamsSchema](#gear-getassetstoreparamsschema)
- [CountCollectionAssetsStoreParamsSchema](#gear-countcollectionassetsstoreparamsschema)
- [CountAssetsStoreParamsSchema](#gear-countassetsstoreparamsschema)
- [SetAssetHandlerParamsSchema](#gear-setassethandlerparamsschema)
- [DeleteAssetsStoreParamsSchema](#gear-deleteassetsstoreparamsschema)
- [DeleteFilteredAssetsStoreParamsSchema](#gear-deletefilteredassetsstoreparamsschema)
- [DeleteAssetStoreParamsSchema](#gear-deleteassetstoreparamsschema)
- [ListAssetsStoreParamsSchema](#gear-listassetsstoreparamsschema)
- [GetContentChunksStoreParamsSchema](#gear-getcontentchunksstoreparamsschema)
- [IDLTypeSchema](#gear-idltypeschema)
- [CallArgSchema](#gear-callargschema)
- [CallArgsSchema](#gear-callargsschema)
- [CallResultSchema](#gear-callresultschema)
- [CallParamsSchema](#gear-callparamsschema)

#### :gear: Uint8ArraySchema

A schema that validates a value is an Uint8Array.

| Constant           | Type                                                                  |
| ------------------ | --------------------------------------------------------------------- |
| `Uint8ArraySchema` | `ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L7)

#### :gear: RawPrincipalSchema

| Constant             | Type                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| `RawPrincipalSchema` | `ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>` |

References:

- RawPrincipal

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L14)

#### :gear: PrincipalSchema

| Constant          | Type                              |
| ----------------- | --------------------------------- |
| `PrincipalSchema` | `ZodCustom<Principal, Principal>` |

References:

- Principal

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/candid.ts#L24)

#### :gear: TimestampSchema

| Constant          | Type        |
| ----------------- | ----------- |
| `TimestampSchema` | `ZodBigInt` |

References:

- Timestamp

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L7)

#### :gear: VersionSchema

| Constant        | Type        |
| --------------- | ----------- |
| `VersionSchema` | `ZodBigInt` |

References:

- Version

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L19)

#### :gear: RawUserIdSchema

| Constant          | Type                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| `RawUserIdSchema` | `ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>` |

References:

- RawUserId

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L31)

#### :gear: UserIdSchema

| Constant       | Type                              |
| -------------- | --------------------------------- |
| `UserIdSchema` | `ZodCustom<Principal, Principal>` |

References:

- UserId

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L43)

#### :gear: CollectionSchema

| Constant           | Type        |
| ------------------ | ----------- |
| `CollectionSchema` | `ZodString` |

References:

- Collection

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L55)

#### :gear: KeySchema

| Constant    | Type        |
| ----------- | ----------- |
| `KeySchema` | `ZodString` |

References:

- Key

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L65)

#### :gear: DescriptionSchema

| Constant            | Type        |
| ------------------- | ----------- |
| `DescriptionSchema` | `ZodString` |

References:

- Description

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/satellite.ts#L75)

#### :gear: CollectionsSchema

| Constant            | Type                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| `CollectionsSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; }, $strict>` |

References:

- Collections

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/collections.ts#L7)

#### :gear: RawDataSchema

| Constant        | Type                                                                  |
| --------------- | --------------------------------------------------------------------- |
| `RawDataSchema` | `ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>` |

References:

- RawData

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L17)

#### :gear: DocSchema

| Constant    | Type                                                                                                                                                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocSchema` | `ZodObject<{ owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; description: ZodOptional<...>; created_at: ZodBigInt; updated_at: ZodBigInt; version: ZodOptional<...>; }, $strict>` |

References:

- Doc

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L29)

#### :gear: OptionDocSchema

| Constant          | Type                                                                                                                                                                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OptionDocSchema` | `ZodOptional<ZodObject<{ owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; description: ZodOptional<...>; created_at: ZodBigInt; updated_at: ZodBigInt; version: ZodOptional<...>; }, $strict>>` |

References:

- OptionDoc

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L79)

#### :gear: SetDocSchema

| Constant       | Type                                                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocSchema` | `ZodObject<{ data: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; description: ZodOptional<ZodString>; version: ZodOptional<...>; }, $strict>` |

References:

- SetDoc

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L89)

#### :gear: DelDocSchema

| Constant       | Type                                                       |
| -------------- | ---------------------------------------------------------- |
| `DelDocSchema` | `ZodObject<{ version: ZodOptional<ZodBigInt>; }, $strict>` |

References:

- DelDoc

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L121)

#### :gear: DocUpsertSchema

| Constant          | Type                                                                                                                                                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DocUpsertSchema` | `ZodObject<{ before: ZodOptional<ZodObject<{ owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodCustom<Uint8Array<...>, Uint8Array<...>>; description: ZodOptional<...>; created_at: ZodBigInt; updated_at: ZodBigInt; version: ZodOptional<...>; }, $strict>>; after: ZodObject<...>; }, $s...` |

References:

- DocUpsert

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L14)

#### :gear: DocAssertSetSchema

| Constant             | Type                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DocAssertSetSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodCustom<...>; description: ZodOptional<...>; created_at: ZodBigInt; updated_at: ZodBigInt; version: ZodOptional<...>; }, $strict>>; proposed: ZodObject<...>; }, $strict>` |

References:

- DocAssertSet

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L41)

#### :gear: DocAssertDeleteSchema

| Constant                | Type                                                                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DocAssertDeleteSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodCustom<...>; description: ZodOptional<...>; created_at: ZodBigInt; updated_at: ZodBigInt; version: ZodOptional<...>; }, $strict>>; proposed: ZodObject<...>; }, $strict>` |

References:

- DocAssertDelete

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L71)

#### :gear: OnSetDocContextSchema

| Constant                | Type                                                                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetDocContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodObject<{ collection: ZodString; key: ZodString; data: ZodObject<...>; }, $strict>; }, $strict>` |

References:

- OnSetDocContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L52)

#### :gear: OnSetManyDocsContextSchema

| Constant                     | Type                                                                                                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OnSetManyDocsContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodArray<ZodObject<{ collection: ZodString; key: ZodString; data: ZodObject<...>; }, $strict>>; }, $strict>` |

References:

- OnSetManyDocsContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L65)

#### :gear: OnDeleteDocContextSchema

| Constant                   | Type                                                                                                                                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteDocContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodObject<{ collection: ZodString; key: ZodString; data: ZodOptional<...>; }, $strict>; }, $strict>` |

References:

- OnDeleteDocContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L80)

#### :gear: OnDeleteManyDocsContextSchema

| Constant                        | Type                                                                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteManyDocsContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodArray<ZodObject<{ collection: ZodString; key: ZodString; data: ZodOptional<...>; }, $strict>>; }, $strict>` |

References:

- OnDeleteManyDocsContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L93)

#### :gear: OnDeleteFilteredDocsContextSchema

| Constant                            | Type                                                                                                                                                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteFilteredDocsContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodArray<ZodObject<{ collection: ZodString; key: ZodString; data: ZodOptional<...>; }, $strict>>; }, $strict>` |

References:

- OnDeleteFilteredDocsContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L108)

#### :gear: AssertSetDocContextSchema

| Constant                    | Type                                                                                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodObject<{ collection: ZodString; key: ZodString; data: ZodObject<...>; }, $strict>; }, $strict>` |

References:

- AssertSetDocContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L123)

#### :gear: AssertDeleteDocContextSchema

| Constant                       | Type                                                                                                                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteDocContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodObject<{ collection: ZodString; key: ZodString; data: ZodObject<...>; }, $strict>; }, $strict>` |

References:

- AssertDeleteDocContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L136)

#### :gear: SatelliteEnvSchema

| Constant             | Type                              |
| -------------------- | --------------------------------- |
| `SatelliteEnvSchema` | `ZodRecord<ZodString, ZodString>` |

References:

- SatelliteEnv

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/satellite.env.ts#L6)

#### :gear: HeaderFieldsSchema

| Constant             | Type                                               |
| -------------------- | -------------------------------------------------- |
| `HeaderFieldsSchema` | `ZodArray<ZodTuple<[ZodString, ZodString], null>>` |

References:

- HeaderFields

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L29)

#### :gear: BlobSchema

| Constant     | Type                                                                  |
| ------------ | --------------------------------------------------------------------- |
| `BlobSchema` | `ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>` |

References:

- Blob

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L39)

#### :gear: AssetKeySchema

| Constant         | Type                                                                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssetKeySchema` | `ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; description: ZodOptional<...>; }, $strict>` |

References:

- AssetKey

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L71)

#### :gear: AssetEncodingSchema

| Constant              | Type                                                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssetEncodingSchema` | `ZodObject<{ modified: ZodBigInt; content_chunks: ZodArray<ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>>; total_length: ZodBigInt; sha256: ZodCustom<...>; }, $strip>` |

References:

- AssetEncoding

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L121)

#### :gear: AssetSchema

| Constant      | Type                                                                                                                                                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssetSchema` | `ZodObject<{ key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; description: ZodOptional<...>; }, $strict>; ... 4 more ...; version: ZodOptional<...>; }, $strict>` |

References:

- Asset

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L176)

#### :gear: AssetNoContentSchema

| Constant               | Type                                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssetNoContentSchema` | `ZodObject<{ version: ZodOptional<ZodBigInt>; created_at: ZodBigInt; updated_at: ZodBigInt; key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<...>; collection: ZodString; owner: ZodCustom<...>; description: ZodOptional<...>; }, $strict>; headers: ZodArray<...>; encodings: ZodArray<...>; }, $s...` |

References:

- AssetNoContent

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L225)

#### :gear: BatchSchema

| Constant      | Type                                                                                                                                                                                                                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BatchSchema` | `ZodObject<{ key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; description: ZodOptional<...>; }, $strict>; reference_id: ZodOptional<...>; expires_at: ZodBigInt; encoding_type: ZodOptional<...>;...` |

References:

- Batch

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L251)

#### :gear: CommitBatchSchema

| Constant            | Type                                                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `CommitBatchSchema` | `ZodObject<{ batch_id: ZodBigInt; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; chunk_ids: ZodArray<ZodBigInt>; }, $strict>` |

References:

- CommitBatch

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L308)

#### :gear: FullPathSchema

| Constant         | Type        |
| ---------------- | ----------- |
| `FullPathSchema` | `ZodString` |

References:

- FullPath

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L339)

#### :gear: OptionAssetSchema

| Constant            | Type                                                                                                                                                                                                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OptionAssetSchema` | `ZodOptional<ZodObject<{ key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; description: ZodOptional<...>; }, $strict>; ... 4 more ...; version: ZodOptional<...>; }, $strict>>` |

References:

- OptionAsset

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L352)

#### :gear: AssetAssertUploadSchema

| Constant                  | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssetAssertUploadSchema` | `ZodObject<{ current: ZodOptional<ZodObject<{ key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodCustom<...>; description: ZodOptional<...>; }, $strict>; ... 4 more ...; version: ZodOptional<...>; }, $strict>>; batch: ZodObject<...>; commit_batch: Z...` |

References:

- AssetAssertUpload

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/payload.ts#L14)

#### :gear: OnUploadAssetContextSchema

| Constant                     | Type                                                                                                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OnUploadAssetContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodObject<{ key: ZodObject<{ name: ZodString; ... 4 more ...; description: ZodOptional<...>; }, $strict>; ... 4 more ...; version: ZodOptional<...>; }, $strict>; }, $strict>` |

References:

- OnUploadAssetContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L9)

#### :gear: OnDeleteAssetContextSchema

| Constant                     | Type                                                                                                                                                                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteAssetContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodOptional<ZodObject<{ key: ZodObject<{ name: ZodString; ... 4 more ...; description: ZodOptional<...>; }, $strict>; ... 4 more ...; version: ZodOptional<...>; }, $strict>>; }, $strict>` |

References:

- OnDeleteAssetContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L21)

#### :gear: OnDeleteManyAssetsContextSchema

| Constant                          | Type                                                                                                                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OnDeleteManyAssetsContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodArray<ZodOptional<ZodObject<{ key: ZodObject<{ ...; }, $strict>; ... 4 more ...; version: ZodOptional<...>; }, $strict>>>; }, $strict>` |

References:

- OnDeleteManyAssetsContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L35)

#### :gear: OnDeleteFilteredAssetsContextSchema

| Constant                              | Type                                                                                                                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OnDeleteFilteredAssetsContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodArray<ZodOptional<ZodObject<{ key: ZodObject<{ ...; }, $strict>; ... 4 more ...; version: ZodOptional<...>; }, $strict>>>; }, $strict>` |

References:

- OnDeleteFilteredAssetsContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L47)

#### :gear: AssertUploadAssetContextSchema

| Constant                         | Type                                                                                                                                                                                                                             |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertUploadAssetContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodObject<{ current: ZodOptional<ZodObject<...>>; batch: ZodObject<...>; commit_batch: ZodObject<...>; }, $strict>; }, $strict>` |

References:

- AssertUploadAssetContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L61)

#### :gear: AssertDeleteAssetContextSchema

| Constant                         | Type                                                                                                                                                                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AssertDeleteAssetContextSchema` | `ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>; data: ZodObject<{ key: ZodObject<{ name: ZodString; ... 4 more ...; description: ZodOptional<...>; }, $strict>; ... 4 more ...; version: ZodOptional<...>; }, $strict>; }, $strict>` |

References:

- AssertDeleteAssetContext

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/context.ts#L73)

#### :gear: AssertSetDocSchema

| Constant             | Type                                                                                                                                                                                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSetDocSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; assert: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodVoid>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- AssertSetDoc

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L45)

#### :gear: AssertDeleteDocSchema

| Constant                | Type                                                                                                                                                                                                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteDocSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; assert: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodVoid>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- AssertDeleteDoc

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L55)

#### :gear: AssertUploadAssetSchema

| Constant                  | Type                                                                                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertUploadAssetSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; assert: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodVoid>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- AssertUploadAsset

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L65)

#### :gear: AssertDeleteAssetSchema

| Constant                  | Type                                                                                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertDeleteAssetSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; assert: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodVoid>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- AssertDeleteAsset

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L75)

#### :gear: AssertSchema

| Constant       | Type                                                                                                                                                                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssertSchema` | `ZodUnion<readonly [ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; assert: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodVoid>, $InferInnerFunctionType<...>>; }, $strict>, ZodObject<......` |

References:

- Assert

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L85)

#### :gear: OnSetDocSchema

| Constant         | Type                                                                                                                                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OnSetDocSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnSetDoc

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L55)

#### :gear: OnSetManyDocsSchema

| Constant              | Type                                                                                                                                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnSetManyDocsSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodArray<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnSetManyDocs

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L65)

#### :gear: OnDeleteDocSchema

| Constant            | Type                                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OnDeleteDocSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnDeleteDoc

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L75)

#### :gear: OnDeleteManyDocsSchema

| Constant                 | Type                                                                                                                                                                                                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteManyDocsSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodArray<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnDeleteManyDocs

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L85)

#### :gear: OnDeleteFilteredDocsSchema

| Constant                     | Type                                                                                                                                                                                                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteFilteredDocsSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodArray<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnDeleteFilteredDocs

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L95)

#### :gear: OnUploadAssetSchema

| Constant              | Type                                                                                                                                                                                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OnUploadAssetSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnUploadAsset

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L105)

#### :gear: OnDeleteAssetSchema

| Constant              | Type                                                                                                                                                                                                                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteAssetSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodOptional<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnDeleteAsset

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L115)

#### :gear: OnDeleteManyAssetsSchema

| Constant                   | Type                                                                                                                                                                                                                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteManyAssetsSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodArray<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnDeleteManyAssets

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L125)

#### :gear: OnDeleteFilteredAssetsSchema

| Constant                       | Type                                                                                                                                                                                                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnDeleteFilteredAssetsSchema` | `ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodArray<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>` |

References:

- OnDeleteFilteredAssets

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L135)

#### :gear: HookSchema

| Constant     | Type                                                                                                                                                                                                                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HookSchema` | `ZodUnion<readonly [ZodObject<{ collections: ZodReadonly<ZodArray<ZodString>>; run: ZodCustom<$InferInnerFunctionType<ZodTuple<[ZodObject<{ caller: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; data: ZodObject<...>; }, $strict>], null>, ZodUnion<...>>, $InferInnerFunctionType<...>>; }, $strict>, ... 7 more...` |

References:

- Hook

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L145)

#### :gear: TimestampMatcherSchema

| Constant                 | Type                                                                                                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TimestampMatcherSchema` | `ZodUnion<readonly [ZodObject<{ equal: ZodBigInt; }, $strip>, ZodObject<{ greater_than: ZodBigInt; }, $strip>, ZodObject<{ less_than: ZodBigInt; }, $strip>, ZodObject<...>]>` |

References:

- TimestampMatcher

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L16)

#### :gear: ListMatcherSchema

| Constant            | Type                                                                                                                                                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ListMatcherSchema` | `ZodObject<{ key: ZodOptional<ZodString>; description: ZodOptional<ZodString>; created_at: ZodOptional<ZodUnion<readonly [ZodObject<{ equal: ZodBigInt; }, $strip>, ZodObject<...>, ZodObject<...>, ZodObject<...>]>>; updated_at: ZodOptional<...>; }, $strict>` |

References:

- ListMatcher

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L35)

#### :gear: ListPaginateSchema

| Constant             | Type                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `ListPaginateSchema` | `ZodObject<{ start_after: ZodOptional<ZodString>; limit: ZodOptional<ZodBigInt>; }, $strict>` |

References:

- ListPaginate

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L57)

#### :gear: ListOrderFieldSchema

| Constant               | Type                                                                             |
| ---------------------- | -------------------------------------------------------------------------------- |
| `ListOrderFieldSchema` | `ZodEnum<{ keys: "keys"; created_at: "created_at"; updated_at: "updated_at"; }>` |

References:

- ListOrderField

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L75)

#### :gear: ListOrderSchema

| Constant          | Type                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `ListOrderSchema` | `ZodObject<{ desc: ZodBoolean; field: ZodEnum<{ keys: "keys"; created_at: "created_at"; updated_at: "updated_at"; }>; }, $strict>` |

References:

- ListOrder

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L85)

#### :gear: ListParamsSchema

| Constant           | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ListParamsSchema` | `ZodObject<{ matcher: ZodOptional<ZodObject<{ key: ZodOptional<ZodString>; description: ZodOptional<ZodString>; created_at: ZodOptional<ZodUnion<readonly [ZodObject<{ equal: ZodBigInt; }, $strip>, ZodObject<...>, ZodObject<...>, ZodObject<...>]>>; updated_at: ZodOptional<...>; }, $strict>>; paginate: ZodOptional<...>...` |

References:

- ListParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L103)

#### :gear: ControllerScopeSchema

| Constant                | Type                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| `ControllerScopeSchema` | `ZodEnum<{ write: "write"; admin: "admin"; submit: "submit"; }>` |

References:

- ControllerScopeSchema

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L15)

#### :gear: MetadataSchema

| Constant         | Type                                     |
| ---------------- | ---------------------------------------- |
| `MetadataSchema` | `ZodTuple<[ZodString, ZodString], null>` |

References:

- MetadataSchema

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L25)

#### :gear: ControllerSchema

| Constant           | Type                                                                                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ControllerSchema` | `ZodObject<{ metadata: ZodArray<ZodTuple<[ZodString, ZodString], null>>; created_at: ZodBigInt; updated_at: ZodBigInt; expires_at: ZodOptional<...>; scope: ZodEnum<...>; }, $strict>` |

References:

- ControllerSchema

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L35)

#### :gear: ControllerRecordSchema

| Constant                 | Type                                                                                                                                                                                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ControllerRecordSchema` | `ZodTuple<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodObject<{ metadata: ZodArray<ZodTuple<[ZodString, ZodString], null>>; created_at: ZodBigInt; updated_at: ZodBigInt; expires_at: ZodOptional<...>; scope: ZodEnum<...>; }, $strict>], null>` |

References:

- ControllerRecordSchema

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L79)

#### :gear: ControllersSchema

| Constant            | Type                                                                                                                                                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ControllersSchema` | `ZodArray<ZodTuple<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodObject<{ metadata: ZodArray<ZodTuple<[ZodString, ZodString], null>>; created_at: ZodBigInt; updated_at: ZodBigInt; expires_at: ZodOptional<...>; scope: ZodEnum<...>; }, $strict>], null>>` |

References:

- ControllersSchema

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L89)

#### :gear: ControllerCheckParamsSchema

| Constant                      | Type                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ControllerCheckParamsSchema` | `ZodObject<{ caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<Principal, Principal>]>; controllers: ZodArray<...>; }, $strip>` |

References:

- ControllerCheckParamsSchema

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L99)

#### :gear: CollectionParamsSchema

| Constant                 | Type                                             |
| ------------------------ | ------------------------------------------------ |
| `CollectionParamsSchema` | `ZodObject<{ collection: ZodString; }, $strict>` |

References:

- CollectionParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/params.ts#L15)

#### :gear: ListStoreParamsSchema

| Constant                | Type                                                                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ListStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; params: ZodObject<...>; }, $strict>` |

References:

- ListStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/params.ts#L34)

#### :gear: GetDocStoreParamsSchema

| Constant                  | Type                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GetDocStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; key: ZodString; }, $strict>` |

References:

- GetDocStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L20)

#### :gear: SetDocStoreParamsSchema

| Constant                  | Type                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; key: ZodString; doc: ZodObject<...>; }, $strict>` |

References:

- SetDocStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L43)

#### :gear: DeleteDocStoreParamsSchema

| Constant                     | Type                                                                                                                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DeleteDocStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; key: ZodString; doc: ZodObject<...>; }, $strict>` |

References:

- DeleteDocStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L63)

#### :gear: CountCollectionDocsStoreParamsSchema

| Constant                               | Type                                             |
| -------------------------------------- | ------------------------------------------------ |
| `CountCollectionDocsStoreParamsSchema` | `ZodObject<{ collection: ZodString; }, $strict>` |

References:

- CountCollectionDocsStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L83)

#### :gear: CountDocsStoreParamsSchema

| Constant                     | Type                                                                                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CountDocsStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; params: ZodObject<...>; }, $strict>` |

References:

- CountDocsStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L93)

#### :gear: ListDocsStoreParamsSchema

| Constant                    | Type                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ListDocsStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; params: ZodObject<...>; }, $strict>` |

References:

- ListDocsStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L103)

#### :gear: DeleteDocsStoreParamsSchema

| Constant                      | Type                                             |
| ----------------------------- | ------------------------------------------------ |
| `DeleteDocsStoreParamsSchema` | `ZodObject<{ collection: ZodString; }, $strict>` |

References:

- DeleteDocsStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L113)

#### :gear: DeleteFilteredDocsStoreParamsSchema

| Constant                              | Type                                                                                                                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DeleteFilteredDocsStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; params: ZodObject<...>; }, $strict>` |

References:

- DeleteFilteredDocsParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L123)

#### :gear: MemorySchema

| Constant       | Type                                           |
| -------------- | ---------------------------------------------- |
| `MemorySchema` | `ZodEnum<{ heap: "heap"; stable: "stable"; }>` |

References:

- Memory

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/collections.ts#L6)

#### :gear: GetAssetStoreParamsSchema

| Constant                    | Type                                                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GetAssetStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; full_path: ZodString; }, $strict>` |

References:

- GetAssetStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L26)

#### :gear: CountCollectionAssetsStoreParamsSchema

| Constant                                 | Type                                             |
| ---------------------------------------- | ------------------------------------------------ |
| `CountCollectionAssetsStoreParamsSchema` | `ZodObject<{ collection: ZodString; }, $strict>` |

References:

- CountCollectionAssetsStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L49)

#### :gear: CountAssetsStoreParamsSchema

| Constant                       | Type                                                                                                                                                                              |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CountAssetsStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; params: ZodObject<...>; }, $strict>` |

References:

- CountAssetsStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L59)

#### :gear: SetAssetHandlerParamsSchema

| Constant                      | Type                                                                                                                                                                                                                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SetAssetHandlerParamsSchema` | `ZodObject<{ key: ZodObject<{ name: ZodString; full_path: ZodString; token: ZodOptional<ZodString>; collection: ZodString; owner: ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<...>>; description: ZodOptional<...>; }, $strict>; content: ZodCustom<...>; headers: ZodArray<...>; }, $strict>` |

References:

- SetAssetHandlerParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L69)

#### :gear: DeleteAssetsStoreParamsSchema

| Constant                        | Type                                             |
| ------------------------------- | ------------------------------------------------ |
| `DeleteAssetsStoreParamsSchema` | `ZodObject<{ collection: ZodString; }, $strict>` |

References:

- DeleteAssetsStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L100)

#### :gear: DeleteFilteredAssetsStoreParamsSchema

| Constant                                | Type                                                                                                                                                                              |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DeleteFilteredAssetsStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; params: ZodObject<...>; }, $strict>` |

References:

- DeleteFilteredAssetsParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L110)

#### :gear: DeleteAssetStoreParamsSchema

| Constant                       | Type                                                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DeleteAssetStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; full_path: ZodString; }, $strict>` |

References:

- DeleteAssetStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L120)

#### :gear: ListAssetsStoreParamsSchema

| Constant                      | Type                                                                                                                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ListAssetsStoreParamsSchema` | `ZodObject<{ collection: ZodString; caller: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<...>]>; params: ZodObject<...>; }, $strict>` |

References:

- ListAssetsStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L130)

#### :gear: GetContentChunksStoreParamsSchema

| Constant                            | Type                                                                                                                                                                                                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GetContentChunksStoreParamsSchema` | `ZodObject<{ encoding: ZodObject<{ modified: ZodBigInt; content_chunks: ZodArray<ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>>; total_length: ZodBigInt; sha256: ZodCustom<...>; }, $strip>; chunk_index: ZodBigInt; memory: ZodEnum<...>; }, $strict>` |

References:

- GetContentChunksStoreParams

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L140)

#### :gear: IDLTypeSchema

| Constant        | Type                                      |
| --------------- | ----------------------------------------- |
| `IDLTypeSchema` | `ZodCustom<Type<unknown>, Type<unknown>>` |

References:

- IDLType

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L9)

#### :gear: CallArgSchema

| Constant        | Type                                                                    |
| --------------- | ----------------------------------------------------------------------- |
| `CallArgSchema` | `ZodTuple<[ZodCustom<Type<unknown>, Type<unknown>>, ZodUnknown], null>` |

References:

- CallArg

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L21)

#### :gear: CallArgsSchema

Schema for encoding the call arguments.

| Constant         | Type                                                                              |
| ---------------- | --------------------------------------------------------------------------------- |
| `CallArgsSchema` | `ZodArray<ZodTuple<[ZodCustom<Type<unknown>, Type<unknown>>, ZodUnknown], null>>` |

References:

- CallArgs

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L33)

#### :gear: CallResultSchema

| Constant           | Type                                      |
| ------------------ | ----------------------------------------- |
| `CallResultSchema` | `ZodCustom<Type<unknown>, Type<unknown>>` |

References:

- CallResult

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L49)

#### :gear: CallParamsSchema

| Constant           | Type                                                                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CallParamsSchema` | `ZodObject<{ canisterId: ZodUnion<[ZodCustom<Uint8Array<ArrayBufferLike>, Uint8Array<ArrayBufferLike>>, ZodCustom<Principal, Principal>]>; method: ZodString; args: ZodOptional<...>; result: ZodOptional<...>; }, $strip>` |

References:

- CallParams

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
- [ListMatcher](#gear-listmatcher)
- [ListPaginate](#gear-listpaginate)
- [ListOrder](#gear-listorder)
- [ListParams](#gear-listparams)
- [ListResults](#gear-listresults)
- [Controller](#gear-controller)
- [ControllerCheckParams](#gear-controllercheckparams)
- [CollectionParams](#gear-collectionparams)
- [SetAssetHandlerParams](#gear-setassethandlerparams)
- [GetContentChunksStoreParams](#gear-getcontentchunksstoreparams)
- [CallParams](#gear-callparams)

#### :gear: Collections

Defines the collections where a hook or assertion should run.

| Property      | Type                | Description                                                                                                        |
| ------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `collections` | `readonly string[]` | An array of collection names where the hook or assertion will run. If empty, no hooks or assertions are triggered. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/collections.ts#L16)

#### :gear: HookContext

Represents the context provided to hooks, containing information about the caller and related data.

| Property | Type                          | Description                                                                     |
| -------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `caller` | `Uint8Array<ArrayBufferLike>` | The user who originally triggered the function that in turn triggered the hook. |
| `data`   | `T`                           | The data associated with the hook execution.                                    |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L22)

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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L43)

#### :gear: SetDoc

Represents the proposed version of a document to be created or updated.
This can be validated before allowing the operation.

| Property      | Type                          | Description                                        |
| ------------- | ----------------------------- | -------------------------------------------------- |
| `data`        | `Uint8Array<ArrayBufferLike>` | The raw data of the document.                      |
| `description` | `string or undefined`         | An optional description of the document.           |
| `version`     | `bigint or undefined`         | The expected version number to ensure consistency. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L101)

#### :gear: DelDoc

Represents the proposed version of a document to be deleted.
This can be validated before allowing the operation.

| Property  | Type                  | Description                                        |
| --------- | --------------------- | -------------------------------------------------- |
| `version` | `bigint or undefined` | The expected version number to ensure consistency. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/db.ts#L131)

#### :gear: DocUpsert

Represents a document update operation.

This is used in hooks where a document is either being created or updated.

| Property | Type               | Description                                                                                  |
| -------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `before` | `Doc or undefined` | The previous version of the document before the update. Undefined if this is a new document. |
| `after`  | `Doc`              | The new version of the document after the update.                                            |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L26)

#### :gear: DocAssertSet

Represents a validation check before setting a document.

The developer can compare the `current` and `proposed` versions and
throw an error if their validation fails.

| Property   | Type               | Description                                                                                    |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `current`  | `Doc or undefined` | The current version of the document before the operation. Undefined if this is a new document. |
| `proposed` | `SetDoc`           | The proposed version of the document. This can be validated before allowing the operation.     |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L54)

#### :gear: DocAssertDelete

Represents a validation check before deleting a document.

The developer can compare the `current` and `proposed` versions and
throw an error if their validation fails.

| Property   | Type               | Description                                                                                         |
| ---------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `current`  | `Doc or undefined` | The current version of the document before the operation. Undefined if the document does not exist. |
| `proposed` | `DelDoc`           | The proposed version of the document. This can be validated before allowing the operation.          |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/payload.ts#L84)

#### :gear: DocContext

Represents the context of a document operation within a collection.

| Property     | Type     | Description                                              |
| ------------ | -------- | -------------------------------------------------------- |
| `collection` | `string` | The name of the collection where the document is stored. |
| `key`        | `string` | The key identifying the document within the collection.  |
| `data`       | `T`      | The data associated with the document operation.         |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L32)

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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L85)

#### :gear: AssetEncoding

Represents a specific encoding of an asset, such as "gzip" or "identity" (no compression).

| Property         | Type          | Description                                     |
| ---------------- | ------------- | ----------------------------------------------- |
| `modified`       | `bigint`      | Timestamp when the encoding was last modified.  |
| `content_chunks` | `BlobOrKey[]` | Chunks of binary content or references to them. |
| `total_length`   | `bigint`      | Total byte size of the encoded content.         |
| `sha256`         | `Hash`        | SHA-256 hash of the encoded content.            |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L131)

#### :gear: Asset

A stored asset including its metadata, encodings, and timestamps.

| Property     | Type                              | Description                                                                                    |
| ------------ | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `key`        | `AssetKey`                        | Metadata about the asset's identity and ownership.                                             |
| `headers`    | `HeaderField[]`                   | Optional HTTP headers associated with the asset.                                               |
| `encodings`  | `[EncodingType, AssetEncoding][]` | A mapping from encoding types (e.g., "identity", "gzip") to the corresponding encoded version. |
| `created_at` | `bigint`                          | Timestamp when the asset was created.                                                          |
| `updated_at` | `bigint`                          | Timestamp when the asset was last updated.                                                     |
| `version`    | `bigint or undefined`             | Optional version number of the asset.                                                          |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L190)

#### :gear: Batch

Represents a batch of chunks to be uploaded and committed to an asset.

| Property        | Type                        | Description                                       |
| --------------- | --------------------------- | ------------------------------------------------- |
| `key`           | `AssetKey`                  | The metadata key for the asset being uploaded.    |
| `reference_id`  | `bigint or undefined`       | Optional reference ID for tracking or validation. |
| `expires_at`    | `bigint`                    | Timestamp when this batch expires.                |
| `encoding_type` | `EncodingType or undefined` | Optional encoding format (e.g., "gzip").          |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L263)

#### :gear: CommitBatch

Represents the final step in uploading an asset, committing the batch to storage.

| Property    | Type            | Description                                       |
| ----------- | --------------- | ------------------------------------------------- |
| `batch_id`  | `bigint`        | The ID of the batch being committed.              |
| `headers`   | `HeaderField[]` | HTTP headers associated with this asset.          |
| `chunk_ids` | `bigint[]`      | List of chunk IDs that make up the asset content. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L319)

#### :gear: AssetAssertUpload

Represents a validation context before uploading an asset.

| Property       | Type                 | Description                                       |
| -------------- | -------------------- | ------------------------------------------------- |
| `current`      | `Asset or undefined` | The current asset already stored (if any).        |
| `batch`        | `Batch`              | The batch metadata being uploaded.                |
| `commit_batch` | `CommitBatch`        | The commit data describing headers and chunk ids. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/storage/payload.ts#L25)

#### :gear: ListMatcher

Matcher used to filter list results.

| Property      | Type                            | Description |
| ------------- | ------------------------------- | ----------- |
| `key`         | `string or undefined`           |             |
| `description` | `string or undefined`           |             |
| `created_at`  | `TimestampMatcher or undefined` |             |
| `updated_at`  | `TimestampMatcher or undefined` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L47)

#### :gear: ListPaginate

Optional pagination controls for listing.

| Property      | Type                  | Description |
| ------------- | --------------------- | ----------- |
| `start_after` | `string or undefined` |             |
| `limit`       | `bigint or undefined` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L67)

#### :gear: ListOrder

Ordering strategy for listing documents.

| Property | Type             | Description |
| -------- | ---------------- | ----------- |
| `desc`   | `boolean`        |             |
| `field`  | `ListOrderField` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L95)

#### :gear: ListParams

Full set of listing parameters.

| Property   | Type                                       | Description |
| ---------- | ------------------------------------------ | ----------- |
| `matcher`  | `ListMatcher or undefined`                 |             |
| `paginate` | `ListPaginate or undefined`                |             |
| `order`    | `ListOrder or undefined`                   |             |
| `owner`    | `Uint8Array<ArrayBufferLike> or undefined` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L115)

#### :gear: ListResults

List results, parameterized by type of returned item.

| Property         | Type                  | Description |
| ---------------- | --------------------- | ----------- |
| `items`          | `[string, T][]`       |             |
| `items_length`   | `bigint`              |             |
| `items_page`     | `bigint or undefined` |             |
| `matches_length` | `bigint`              |             |
| `matches_pages`  | `bigint or undefined` |             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L142)

#### :gear: Controller

Represents a controller with access scope and associated metadata.

| Property     | Type                             | Description                                                                                        |
| ------------ | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `metadata`   | `[string, string][]`             | A list of key-value metadata pairs associated with the controller.                                 |
| `created_at` | `bigint`                         | The timestamp when the controller was created.                                                     |
| `updated_at` | `bigint`                         | The timestamp when the controller was last updated.                                                |
| `expires_at` | `bigint or undefined`            | Optional expiration timestamp for the controller. 👉 It's a placeholder for future implementation. |
| `scope`      | `"write" or "admin" or "submit"` | The scope assigned to the controller.                                                              |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L48)

#### :gear: ControllerCheckParams

Represents the parameters required to perform controller checks.

| Property      | Type                                                                                                                                                                                  | Description                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `caller`      | `Uint8Array<ArrayBufferLike> or Principal`                                                                                                                                            | The identity of the caller to verify against the controller list. |
| `controllers` | `[Uint8Array<ArrayBufferLike>, { metadata: [string, string][]; created_at: bigint; updated_at: bigint; scope: "write" or "admin" or "submit"; expires_at?: bigint or undefined; }][]` | The list of controllers to check against.                         |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/controllers.ts#L107)

#### :gear: CollectionParams

The parameters required to scope an operation to a collection.

| Property     | Type     | Description                           |
| ------------ | -------- | ------------------------------------- |
| `collection` | `string` | The name of the collection to target. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/params.ts#L24)

#### :gear: SetAssetHandlerParams

The parameters required to set (or update) an asset.

| Property  | Type           | Description                      |
| --------- | -------------- | -------------------------------- |
| `key`     | `AssetKey`     | The key identifying the asset.   |
| `content` | `Blob`         | The binary content of the asset. |
| `headers` | `HeaderFields` | Associated HTTP headers.         |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L80)

#### :gear: GetContentChunksStoreParams

The parameters required to retrieve a specific chunk from an asset.

| Property      | Type                 | Description                                 |
| ------------- | -------------------- | ------------------------------------------- |
| `encoding`    | `AssetEncoding`      | The encoding of the chunks.                 |
| `chunk_index` | `bigint`             | The index of the chunk to retrieve.         |
| `memory`      | `"heap" or "stable"` | The memory type to retrieve the chunk from. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L151)

#### :gear: CallParams

Type representing the parameters required to make a canister call.

| Property     | Type                                       | Description                                                       |
| ------------ | ------------------------------------------ | ----------------------------------------------------------------- |
| `canisterId` | `Uint8Array<ArrayBufferLike> or Principal` | The target canister's ID.                                         |
| `method`     | `string`                                   | The name of the method to call. Minimum one character.            |
| `args`       | `[Type<unknown>, unknown][] or undefined`  | The arguments, including types and values, for the canister call. |
| `result`     | `Type<unknown> or undefined`               | The expected result type used for decoding the response.          |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/ic-cdk/schemas/call.ts#L69)

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
- [HeaderFields](#gear-headerfields)
- [Blob](#gear-blob)
- [BlobOrKey](#gear-bloborkey)
- [Hash](#gear-hash)
- [AssetEncodingNoContent](#gear-assetencodingnocontent)
- [EncodingType](#gear-encodingtype)
- [AssetNoContent](#gear-assetnocontent)
- [ReferenceId](#gear-referenceid)
- [ChunkId](#gear-chunkid)
- [BatchId](#gear-batchid)
- [FullPath](#gear-fullpath)
- [OptionAsset](#gear-optionasset)
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
- [TimestampMatcher](#gear-timestampmatcher)
- [ListOrderField](#gear-listorderfield)
- [ControllerScope](#gear-controllerscope)
- [Metadata](#gear-metadata)
- [ControllerRecord](#gear-controllerrecord)
- [Controllers](#gear-controllers)
- [ListStoreParams](#gear-liststoreparams)
- [GetDocStoreParams](#gear-getdocstoreparams)
- [SetDocStoreParams](#gear-setdocstoreparams)
- [DeleteDocStoreParams](#gear-deletedocstoreparams)
- [CountCollectionDocsStoreParams](#gear-countcollectiondocsstoreparams)
- [CountDocsStoreParams](#gear-countdocsstoreparams)
- [ListDocsStoreParams](#gear-listdocsstoreparams)
- [DeleteDocsStoreParams](#gear-deletedocsstoreparams)
- [DeleteFilteredDocsStoreParams](#gear-deletefiltereddocsstoreparams)
- [Memory](#gear-memory)
- [GetAssetStoreParams](#gear-getassetstoreparams)
- [CountCollectionAssetsStoreParams](#gear-countcollectionassetsstoreparams)
- [CountAssetsStoreParams](#gear-countassetsstoreparams)
- [DeleteAssetsStoreParams](#gear-deleteassetsstoreparams)
- [DeleteFilteredAssetsStoreParams](#gear-deletefilteredassetsstoreparams)
- [DeleteAssetStoreParams](#gear-deleteassetstoreparams)
- [ListAssetsStoreParams](#gear-listassetsstoreparams)
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

A key identifier within a collection.

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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L47)

#### :gear: RunFunction

Defines the `run` function schema for hooks.

The function takes a context argument and returns either a `Promise<void>` or `void`.

| Type          | Type                                    |
| ------------- | --------------------------------------- |
| `RunFunction` | `(context: T) => void or Promise<void>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/context.ts#L64)

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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L60)

#### :gear: OnSetManyDocsContext

The context provided to the `onSetManyDocs` hook.

This context contains information about multiple documents being created or updated
in a single operation, along with details about the user who triggered it.

| Type                   | Type                                   |
| ---------------------- | -------------------------------------- |
| `OnSetManyDocsContext` | `HookContext<DocContext<DocUpsert>[]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L75)

#### :gear: OnDeleteDocContext

The context provided to the `onDeleteDoc` hook.

This context contains information about a single document being deleted,
along with details about the user who triggered the operation.

| Type                 | Type                                 |
| -------------------- | ------------------------------------ |
| `OnDeleteDocContext` | `HookContext<DocContext<OptionDoc>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L88)

#### :gear: OnDeleteManyDocsContext

The context provided to the `onDeleteManyDocs` hook.

This context contains information about multiple documents being deleted,
along with details about the user who triggered the operation.

| Type                      | Type                                   |
| ------------------------- | -------------------------------------- |
| `OnDeleteManyDocsContext` | `HookContext<DocContext<OptionDoc>[]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L103)

#### :gear: OnDeleteFilteredDocsContext

The context provided to the `onDeleteFilteredDocs` hook.

This context contains information about documents deleted as a result of a filter,
along with details about the user who triggered the operation.

| Type                          | Type                                   |
| ----------------------------- | -------------------------------------- |
| `OnDeleteFilteredDocsContext` | `HookContext<DocContext<OptionDoc>[]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L118)

#### :gear: AssertSetDocContext

The context provided to the `assertDeleteDoc` hook.

This context contains information about the document being validated before
it is created or updated. If validation fails, the developer should throw an error.

| Type                  | Type                                    |
| --------------------- | --------------------------------------- |
| `AssertSetDocContext` | `HookContext<DocContext<DocAssertSet>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L131)

#### :gear: AssertDeleteDocContext

The context provided to the `assertDeleteDoc` hook.

This context contains information about the document being validated before
it is deleted. If validation fails, the developer should throw an error.

| Type                     | Type                                       |
| ------------------------ | ------------------------------------------ |
| `AssertDeleteDocContext` | `HookContext<DocContext<DocAssertDelete>>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/schemas/db/context.ts#L146)

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

#### :gear: HeaderFields

Represents a list of HTTP headers.

| Type           | Type            |
| -------------- | --------------- |
| `HeaderFields` | `HeaderField[]` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L34)

#### :gear: Blob

Binary content used in asset encoding.

| Type   | Type         |
| ------ | ------------ |
| `Blob` | `Uint8Array` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L44)

#### :gear: BlobOrKey

When stable memory is used, chunks are saved within a StableBTreeMap and their keys - StableEncodingChunkKey - are saved for reference as serialized values

| Type        | Type         |
| ----------- | ------------ |
| `BlobOrKey` | `Uint8Array` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L54)

#### :gear: Hash

Represents a SHA-256 hash as a 32-byte binary value.

| Type   | Type         |
| ------ | ------------ |
| `Hash` | `Uint8Array` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L66)

#### :gear: AssetEncodingNoContent

Represents a specific encoding of an asset, such as "gzip" or "identity" (no compression), without the chunks.

| Type                     | Type                                    |
| ------------------------ | --------------------------------------- |
| `AssetEncodingNoContent` | `Omit<AssetEncoding, 'content_chunks'>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L161)

#### :gear: EncodingType

A string identifier representing a specific encoding format (e.g., "gzip", "identity").

| Type           | Type                                                      |
| -------------- | --------------------------------------------------------- |
| `EncodingType` | `'identity' or 'gzip' or 'compress' or 'deflate' or 'br'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L171)

#### :gear: AssetNoContent

A stored asset including its metadata, encodings without chunks, and timestamps.

| Type             | Type                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------- |
| `AssetNoContent` | `Omit<Asset, 'encodings'> and { encodings: [EncodingType, AssetEncodingNoContent][]; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L234)

#### :gear: ReferenceId

A unique reference identifier for batches.

| Type          | Type |
| ------------- | ---- |
| `ReferenceId` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L246)

#### :gear: ChunkId

A unique identifier representing a single chunk of data.

| Type      | Type |
| --------- | ---- |
| `ChunkId` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L293)

#### :gear: BatchId

A unique identifier representing a batch of upload.

| Type      | Type |
| --------- | ---- |
| `BatchId` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L303)

#### :gear: FullPath

Represents the relative path of an asset in storage.
For assets that are not part of the frontend app, the collection must be included at the root of the path.

Example: `/images/a-sun-above-the-mountains.png`

| Type       | Type |
| ---------- | ---- |
| `FullPath` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L347)

#### :gear: OptionAsset

A shorthand for an asset that might or not be defined.

| Type          | Type                 |
| ------------- | -------------------- |
| `OptionAsset` | `Asset or undefined` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/storage.ts#L357)

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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L38)

#### :gear: AssertSetDoc

An assertion that runs when a document is created or updated.

| Type           | Type                            |
| -------------- | ------------------------------- |
| `AssertSetDoc` | `OnAssert<AssertSetDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L50)

#### :gear: AssertDeleteDoc

An assertion that runs when a document is deleted.

| Type              | Type                               |
| ----------------- | ---------------------------------- |
| `AssertDeleteDoc` | `OnAssert<AssertDeleteDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L60)

#### :gear: AssertUploadAsset

An assertion that runs before an asset is uploaded.

| Type                | Type                                 |
| ------------------- | ------------------------------------ |
| `AssertUploadAsset` | `OnAssert<AssertUploadAssetContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L70)

#### :gear: AssertDeleteAsset

An assertion that runs before an asset is deleted.

| Type                | Type                                 |
| ------------------- | ------------------------------------ |
| `AssertDeleteAsset` | `OnAssert<AssertDeleteAssetContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L80)

#### :gear: Assert

All assertions definitions.

| Type     | Type                                                                        |
| -------- | --------------------------------------------------------------------------- |
| `Assert` | `AssertSetDoc or AssertDeleteDoc or AssertUploadAsset or AssertDeleteAsset` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L95)

#### :gear: AssertFn

| Type       | Type                                                |
| ---------- | --------------------------------------------------- |
| `AssertFn` | `(assert: z.infer<typeof SatelliteEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L102)

#### :gear: AssertFnOrObject

| Type               | Type               |
| ------------------ | ------------------ |
| `AssertFnOrObject` | `T or AssertFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/assertions.ts#L106)

#### :gear: OnHook

A generic schema for defining hooks related to collections.

| Type     | Type                                                                                                                                                                                                                                                                               |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OnHook` | `Collections and { /** * A function that runs when the hook is triggered for the specified collections. * * @param {T} context - Contains information about the affected document(s). * @returns {Promise<void>} Resolves when the operation completes. */ run: RunFunction<T>; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L42)

#### :gear: OnSetDoc

A hook that runs when a document is created or updated.

| Type       | Type                      |
| ---------- | ------------------------- |
| `OnSetDoc` | `OnHook<OnSetDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L60)

#### :gear: OnSetManyDocs

A hook that runs when multiple documents are created or updated.

| Type            | Type                           |
| --------------- | ------------------------------ |
| `OnSetManyDocs` | `OnHook<OnSetManyDocsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L70)

#### :gear: OnDeleteDoc

A hook that runs when a single document is deleted.

| Type          | Type                         |
| ------------- | ---------------------------- |
| `OnDeleteDoc` | `OnHook<OnDeleteDocContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L80)

#### :gear: OnDeleteManyDocs

A hook that runs when multiple documents are deleted.

| Type               | Type                              |
| ------------------ | --------------------------------- |
| `OnDeleteManyDocs` | `OnHook<OnDeleteManyDocsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L90)

#### :gear: OnDeleteFilteredDocs

A hook that runs when a filtered set of documents is deleted based on query conditions.

| Type                   | Type                                  |
| ---------------------- | ------------------------------------- |
| `OnDeleteFilteredDocs` | `OnHook<OnDeleteFilteredDocsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L100)

#### :gear: OnUploadAsset

A hook that runs when a single asset is uploaded.

| Type            | Type                           |
| --------------- | ------------------------------ |
| `OnUploadAsset` | `OnHook<OnUploadAssetContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L110)

#### :gear: OnDeleteAsset

A hook that runs when a single asset is potentially deleted.

| Type            | Type                           |
| --------------- | ------------------------------ |
| `OnDeleteAsset` | `OnHook<OnDeleteAssetContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L120)

#### :gear: OnDeleteManyAssets

A hook that runs when multiple assets are potentially deleted.

| Type                 | Type                                |
| -------------------- | ----------------------------------- |
| `OnDeleteManyAssets` | `OnHook<OnDeleteManyAssetsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L130)

#### :gear: OnDeleteFilteredAssets

A hook that runs when a filtered set of assets is deleted based on query conditions.

| Type                     | Type                                    |
| ------------------------ | --------------------------------------- |
| `OnDeleteFilteredAssets` | `OnHook<OnDeleteFilteredAssetsContext>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L140)

#### :gear: Hook

All hooks definitions.

| Type   | Type |
| ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hook` | `    | OnSetDoc or OnSetManyDocs or OnDeleteDoc or OnDeleteManyDocs or OnDeleteFilteredDocs or OnUploadAsset or OnDeleteAsset or OnDeleteManyAssets or OnDeleteFilteredAssets` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L160)

#### :gear: HookFn

| Type     | Type                                              |
| -------- | ------------------------------------------------- |
| `HookFn` | `(hook: z.infer<typeof SatelliteEnvSchema>) => T` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L173)

#### :gear: HookFnOrObject

| Type             | Type             |
| ---------------- | ---------------- |
| `HookFnOrObject` | `T or HookFn<T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/hooks/hooks.ts#L177)

#### :gear: TimestampMatcher

TimestampMatcher matches a timestamp field using a specific strategy.

| Type               | Type |
| ------------------ | ---- | --------------------------------------------------------------------------------------------------------------- |
| `TimestampMatcher` | `    | {equal: Timestamp} or {greater_than: Timestamp} or {less_than: Timestamp} or {between: [Timestamp, Timestamp]}` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L26)

#### :gear: ListOrderField

Enum representing possible fields to order by.

| Type             | Type                                     |
| ---------------- | ---------------------------------------- |
| `ListOrderField` | `'keys' or 'updated_at' or 'created_at'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/schemas/list.ts#L80)

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

#### :gear: ListStoreParams

The parameters required to list documents from the datastore respectively assets from the storage.

| Type              | Type                                                                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ListStoreParams` | `CollectionParams and { /** * The identity of the caller requesting the list operation. */ caller: RawUserId or UserId;  /** * Optional filtering, ordering, and pagination parameters. */ params: ListParams; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/params.ts#L42)

#### :gear: GetDocStoreParams

Represents the base parameters required to access the datastore and modify a document.

| Type                | Type                                                                                                                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GetDocStoreParams` | `CollectionParams and { /** * The caller who initiate the document operation. */ caller: RawUserId or UserId;  /** * The key identifying the document within the collection. */ key: Key; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L28)

#### :gear: SetDocStoreParams

Represents the parameters required to store or update a document.

This includes the document data along with metadata such as the caller,
collection, and key.

| Type                | Type                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `SetDocStoreParams` | `GetDocStoreParams and { /** * The data, optional description and version required to create or update a document. */ doc: SetDoc; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L53)

#### :gear: DeleteDocStoreParams

Represents the parameters required to delete a document.

This includes the document version along with metadata such as the caller,
collection, and key.

| Type                   | Type                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `DeleteDocStoreParams` | `GetDocStoreParams and { /** * The version required to delete a document. */ doc: DelDoc; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L73)

#### :gear: CountCollectionDocsStoreParams

The parameters required to count documents from the datastore.

| Type                             | Type               |
| -------------------------------- | ------------------ |
| `CountCollectionDocsStoreParams` | `CollectionParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L88)

#### :gear: CountDocsStoreParams

The parameters required to count documents from the datastore.

| Type                   | Type              |
| ---------------------- | ----------------- |
| `CountDocsStoreParams` | `ListStoreParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L98)

#### :gear: ListDocsStoreParams

The parameters required to list documents from the datastore.

| Type                  | Type              |
| --------------------- | ----------------- |
| `ListDocsStoreParams` | `ListStoreParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L108)

#### :gear: DeleteDocsStoreParams

The parameters required to delete the documents from a collection of the datastore.

| Type                    | Type               |
| ----------------------- | ------------------ |
| `DeleteDocsStoreParams` | `CollectionParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L118)

#### :gear: DeleteFilteredDocsStoreParams

The parameters required to delete documents from the datastore.

| Type                            | Type              |
| ------------------------------- | ----------------- |
| `DeleteFilteredDocsStoreParams` | `ListStoreParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/db.ts#L128)

#### :gear: Memory

Memory type used to select storage or datastore location.

| Type     | Type                           |
| -------- | ------------------------------ |
| `Memory` | `z.infer<typeof MemorySchema>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/collections.ts#L11)

#### :gear: GetAssetStoreParams

Represents the base parameters required to access the storage and modify an asset.

| Type                  | Type                                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GetAssetStoreParams` | `CollectionParams and { /** * The caller who initiate the document operation. */ caller: RawUserId or UserId;  /** * The full_path identifying the asset within the collection. */ full_path: FullPath; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L34)

#### :gear: CountCollectionAssetsStoreParams

The parameters required to count documents from the storage.

| Type                               | Type               |
| ---------------------------------- | ------------------ |
| `CountCollectionAssetsStoreParams` | `CollectionParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L54)

#### :gear: CountAssetsStoreParams

The parameters required to count documents from the storage.

| Type                     | Type              |
| ------------------------ | ----------------- |
| `CountAssetsStoreParams` | `ListStoreParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L64)

#### :gear: DeleteAssetsStoreParams

The parameters required to delete the assets from a collection of the storage.

| Type                      | Type               |
| ------------------------- | ------------------ |
| `DeleteAssetsStoreParams` | `CollectionParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L105)

#### :gear: DeleteFilteredAssetsStoreParams

The parameters required to delete assets from the storage.

| Type                              | Type              |
| --------------------------------- | ----------------- |
| `DeleteFilteredAssetsStoreParams` | `ListStoreParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L115)

#### :gear: DeleteAssetStoreParams

Represents the parameters required to delete an asset.

| Type                     | Type                  |
| ------------------------ | --------------------- |
| `DeleteAssetStoreParams` | `GetAssetStoreParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L125)

#### :gear: ListAssetsStoreParams

The parameters required to list documents from the datastore.

| Type                    | Type              |
| ----------------------- | ----------------- |
| `ListAssetsStoreParams` | `ListStoreParams` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/functions/src/sdk/schemas/storage.ts#L135)

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
