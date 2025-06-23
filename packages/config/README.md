[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/config
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/config
[npm-license]: https://img.shields.io/npm/l/@junobuild/config
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno Config

Configuration options for [Juno] CLI.

<!-- TSDOC_START -->

### :toolbox: Functions

- [defineDevConfig](#gear-definedevconfig)
- [defineDevConfig](#gear-definedevconfig)
- [defineDevConfig](#gear-definedevconfig)
- [defineDevConfig](#gear-definedevconfig)

#### :gear: defineDevConfig

| Function          | Type                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineDevConfig` | `{ (config: JunoDevConfig): JunoDevConfig; (config: JunoDevConfigFn): JunoDevConfigFn; (config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/config.ts#L7)

#### :gear: defineDevConfig

| Function          | Type                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineDevConfig` | `{ (config: JunoDevConfig): JunoDevConfig; (config: JunoDevConfigFn): JunoDevConfigFn; (config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/config.ts#L8)

#### :gear: defineDevConfig

| Function          | Type                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineDevConfig` | `{ (config: JunoDevConfig): JunoDevConfig; (config: JunoDevConfigFn): JunoDevConfigFn; (config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/config.ts#L9)

#### :gear: defineDevConfig

| Function          | Type                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineDevConfig` | `{ (config: JunoDevConfig): JunoDevConfig; (config: JunoDevConfigFn): JunoDevConfigFn; (config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/config.ts#L10)

### :wrench: Constants

- [JunoConfigModeSchema](#gear-junoconfigmodeschema)
- [JunoConfigEnvSchema](#gear-junoconfigenvschema)
- [OrbiterIdSchema](#gear-orbiteridschema)
- [OrbiterIdsSchema](#gear-orbiteridsschema)
- [OrbiterConfigSchema](#gear-orbiterconfigschema)
- [ModuleLogVisibilitySchema](#gear-modulelogvisibilityschema)
- [ModuleSettingsSchema](#gear-modulesettingsschema)
- [MaxMemorySizeConfigSchema](#gear-maxmemorysizeconfigschema)
- [StorageConfigSourceGlobSchema](#gear-storageconfigsourceglobschema)
- [StorageConfigHeaderSchema](#gear-storageconfigheaderschema)
- [StorageConfigRewriteSchema](#gear-storageconfigrewriteschema)
- [StorageConfigRedirectSchema](#gear-storageconfigredirectschema)
- [StorageConfigSchema](#gear-storageconfigschema)
- [EncodingTypeSchema](#gear-encodingtypeschema)
- [CliConfigSchema](#gear-cliconfigschema)
- [SatelliteAssertionsSchema](#gear-satelliteassertionsschema)
- [AuthenticationConfigInternetIdentitySchema](#gear-authenticationconfiginternetidentityschema)
- [AuthenticationConfigSchema](#gear-authenticationconfigschema)
- [DatastoreConfigSchema](#gear-datastoreconfigschema)
- [SatelliteIdSchema](#gear-satelliteidschema)
- [SatelliteIdsSchema](#gear-satelliteidsschema)
- [SatelliteConfigOptionsSchema](#gear-satelliteconfigoptionsschema)
- [JunoConfigSchema](#gear-junoconfigschema)
- [SatelliteDevDataStoreCollectionSchema](#gear-satellitedevdatastorecollectionschema)
- [SatelliteDevStorageCollectionSchema](#gear-satellitedevstoragecollectionschema)
- [SatelliteDevCollectionsSchema](#gear-satellitedevcollectionsschema)
- [SatelliteDevControllerSchema](#gear-satellitedevcontrollerschema)
- [SatelliteDevConfigSchema](#gear-satellitedevconfigschema)
- [JunoDevConfigSchema](#gear-junodevconfigschema)

#### :gear: JunoConfigModeSchema

| Constant               | Type                                                       |
| ---------------------- | ---------------------------------------------------------- |
| `JunoConfigModeSchema` | `ZodUnion<readonly [ZodLiteral<"production">, ZodString]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L6)

#### :gear: JunoConfigEnvSchema

| Constant              | Type                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `JunoConfigEnvSchema` | `ZodObject<{ mode: ZodUnion<readonly [ZodLiteral<"production">, ZodString]>; }, $strip>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L17)

#### :gear: OrbiterIdSchema

| Constant          | Type                                    |
| ----------------- | --------------------------------------- |
| `OrbiterIdSchema` | `ZodObject<{ id: ZodString; }, $strip>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/orbiter.config.ts#L9)

#### :gear: OrbiterIdsSchema

| Constant           | Type                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `OrbiterIdsSchema` | `ZodObject<{ ids: ZodRecord<ZodUnion<readonly [ZodLiteral<"production">, ZodString]>, ZodString>; }, $strip>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/orbiter.config.ts#L28)

#### :gear: OrbiterConfigSchema

| Constant              | Type                                                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OrbiterConfigSchema` | `ZodUnion<readonly [ZodObject<{ id: ZodString; }, $strict>, ZodObject<{ ids: ZodRecord<ZodUnion<readonly [ZodLiteral<"production">, ZodString]>, ZodString>; }, $strict>]>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/orbiter.config.ts#L55)

#### :gear: ModuleLogVisibilitySchema

| Constant                    | Type                                                         |
| --------------------------- | ------------------------------------------------------------ |
| `ModuleLogVisibilitySchema` | `ZodEnum<{ controllers: "controllers"; public: "public"; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/module/module.settings.ts#L6)

#### :gear: ModuleSettingsSchema

| Constant               | Type                                                                                                                                                                                                                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ModuleSettingsSchema` | `ZodObject<{ freezingThreshold: ZodOptional<ZodBigInt>; reservedCyclesLimit: ZodOptional<ZodBigInt>; logVisibility: ZodOptional<ZodEnum<{ controllers: "controllers"; public: "public"; }>>; heapMemoryLimit: ZodOptional<...>; memoryAllocation: ZodOptional<...>; computeAllocation: ZodOptional<...>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/module/module.settings.ts#L21)

#### :gear: MaxMemorySizeConfigSchema

| Constant                    | Type                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `MaxMemorySizeConfigSchema` | `ZodObject<{ heap: ZodOptional<ZodBigInt>; stable: ZodOptional<ZodBigInt>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/feature.config.ts#L6)

#### :gear: StorageConfigSourceGlobSchema

| Constant                        | Type        |
| ------------------------------- | ----------- |
| `StorageConfigSourceGlobSchema` | `ZodString` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L7)

#### :gear: StorageConfigHeaderSchema

| Constant                    | Type                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| `StorageConfigHeaderSchema` | `ZodObject<{ source: ZodString; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L18)

#### :gear: StorageConfigRewriteSchema

| Constant                     | Type                                                                 |
| ---------------------------- | -------------------------------------------------------------------- |
| `StorageConfigRewriteSchema` | `ZodObject<{ source: ZodString; destination: ZodString; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L49)

#### :gear: StorageConfigRedirectSchema

| Constant                      | Type                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `StorageConfigRedirectSchema` | `ZodObject<{ source: ZodString; location: ZodString; code: ZodUnion<readonly [ZodLiteral<301>, ZodLiteral<302>]>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L79)

#### :gear: StorageConfigSchema

| Constant              | Type                                                                                                                                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StorageConfigSchema` | `ZodObject<{ headers: ZodOptional<ZodArray<ZodObject<{ source: ZodString; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; }, $strict>>>; ... 4 more ...; maxMemorySize: ZodOptional<...>; }, $strip>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L114)

#### :gear: EncodingTypeSchema

see EncodingType

| Constant             | Type                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `EncodingTypeSchema` | `ZodEnum<{ identity: "identity"; gzip: "gzip"; compress: "compress"; deflate: "deflate"; br: "br"; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/encoding.ts#L6)

#### :gear: CliConfigSchema

| Constant          | Type                                                                                                                                                                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CliConfigSchema` | `ZodObject<{ source: ZodOptional<ZodString>; ignore: ZodOptional<ZodArray<ZodString>>; gzip: ZodOptional<ZodUnion<readonly [ZodString, ZodLiteral<...>]>>; encoding: ZodOptional<...>; predeploy: ZodOptional<...>; postdeploy: ZodOptional<...>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/cli.config.ts#L7)

#### :gear: SatelliteAssertionsSchema

| Constant                    | Type                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| `SatelliteAssertionsSchema` | `ZodObject<{ heapMemory: ZodOptional<ZodUnion<readonly [ZodNumber, ZodBoolean]>>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/assertions.config.ts#L6)

#### :gear: AuthenticationConfigInternetIdentitySchema

| Constant                                     | Type                                                                                                                        |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `AuthenticationConfigInternetIdentitySchema` | `ZodObject<{ derivationOrigin: ZodOptional<ZodURL>; externalAlternativeOrigins: ZodOptional<ZodArray<ZodURL>>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/authentication.config.ts#L6)

#### :gear: AuthenticationConfigSchema

| Constant                     | Type                                                                                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AuthenticationConfigSchema` | `ZodObject<{ internetIdentity: ZodOptional<ZodObject<{ derivationOrigin: ZodOptional<ZodURL>; externalAlternativeOrigins: ZodOptional<ZodArray<ZodURL>>; }, $strict>>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/authentication.config.ts#L35)

#### :gear: DatastoreConfigSchema

| Constant                | Type                                                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `DatastoreConfigSchema` | `ZodObject<{ maxMemorySize: ZodOptional<ZodObject<{ heap: ZodOptional<ZodBigInt>; stable: ZodOptional<ZodBigInt>; }, $strict>>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/datastore.config.ts#L7)

#### :gear: SatelliteIdSchema

| Constant            | Type                                    |
| ------------------- | --------------------------------------- |
| `SatelliteIdSchema` | `ZodObject<{ id: ZodString; }, $strip>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/satellite.config.ts#L15)

#### :gear: SatelliteIdsSchema

| Constant             | Type                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `SatelliteIdsSchema` | `ZodObject<{ ids: ZodRecord<ZodUnion<readonly [ZodLiteral<"production">, ZodString]>, ZodString>; }, $strip>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/satellite.config.ts#L34)

#### :gear: SatelliteConfigOptionsSchema

| Constant                       | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SatelliteConfigOptionsSchema` | `ZodUnion<readonly [ZodObject<{ storage: ZodOptional<ZodObject<{ headers: ZodOptional<ZodArray<ZodObject<{ source: ZodString; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; }, $strict>>>; ... 4 more ...; maxMemorySize: ZodOptional<...>; }, $strip>>; ... 4 more ...; id: ZodString; }, $strict>, ZodObject<.....` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/satellite.config.ts#L69)

#### :gear: JunoConfigSchema

| Constant           | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JunoConfigSchema` | `ZodObject<{ satellite: ZodUnion<readonly [ZodObject<{ storage: ZodOptional<ZodObject<{ headers: ZodOptional<ZodArray<ZodObject<{ source: ZodString; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; }, $strict>>>; ... 4 more ...; maxMemorySize: ZodOptional<...>; }, $strip>>; ... 4 more ...; id: ZodString; },...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/juno.config.ts#L8)

#### :gear: SatelliteDevDataStoreCollectionSchema

| Constant                                | Type                                                                                                                                                                                                                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SatelliteDevDataStoreCollectionSchema` | `ZodObject<{ collection: ZodString; read: ZodEnum<{ controllers: "controllers"; public: "public"; private: "private"; managed: "managed"; }>; write: ZodEnum<{ controllers: "controllers"; public: "public"; private: "private"; managed: "managed"; }>; ... 4 more ...; maxTokens: ZodOptional<...>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L7)

#### :gear: SatelliteDevStorageCollectionSchema

| Constant                              | Type                                                                                                                                                                                                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SatelliteDevStorageCollectionSchema` | `ZodObject<{ collection: ZodString; read: ZodEnum<{ controllers: "controllers"; public: "public"; private: "private"; managed: "managed"; }>; write: ZodEnum<{ controllers: "controllers"; public: "public"; private: "private"; managed: "managed"; }>; ... 4 more ...; maxTokens: ZodOptional<...>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L26)

#### :gear: SatelliteDevCollectionsSchema

| Constant                        | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SatelliteDevCollectionsSchema` | `ZodObject<{ datastore: ZodOptional<ZodArray<ZodObject<{ collection: ZodString; read: ZodEnum<{ controllers: "controllers"; public: "public"; private: "private"; managed: "managed"; }>; write: ZodEnum<{ controllers: "controllers"; public: "public"; private: "private"; managed: "managed"; }>; ... 4 more ...; maxTokens...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L45)

#### :gear: SatelliteDevControllerSchema

| Constant                       | Type                                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `SatelliteDevControllerSchema` | `ZodObject<{ id: ZodString; scope: ZodEnum<{ write: "write"; admin: "admin"; submit: "submit"; }>; }, $strict>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L73)

#### :gear: SatelliteDevConfigSchema

| Constant                   | Type                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SatelliteDevConfigSchema` | `ZodObject<{ collections: ZodObject<{ datastore: ZodOptional<ZodArray<ZodObject<{ collection: ZodString; read: ZodEnum<{ controllers: "controllers"; public: "public"; private: "private"; managed: "managed"; }>; ... 5 more ...; maxTokens: ZodOptional<...>; }, $strict>>>; storage: ZodOptional<...>; }, $strict>; control...` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L99)

#### :gear: JunoDevConfigSchema

| Constant              | Type                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JunoDevConfigSchema` | `ZodObject<{ satellite: ZodObject<{ collections: ZodObject<{ datastore: ZodOptional<ZodArray<ZodObject<{ collection: ZodString; read: ZodEnum<{ controllers: "controllers"; public: "public"; private: "private"; managed: "managed"; }>; ... 5 more ...; maxTokens: ZodOptional<...>; }, $strict>>>; storage: ZodOptional<......` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L126)

### :tropical_drink: Interfaces

- [JunoConfigEnv](#gear-junoconfigenv)
- [OrbiterId](#gear-orbiterid)
- [OrbiterIds](#gear-orbiterids)
- [ModuleSettings](#gear-modulesettings)
- [MaxMemorySizeConfig](#gear-maxmemorysizeconfig)
- [StorageConfigHeader](#gear-storageconfigheader)
- [StorageConfigRewrite](#gear-storageconfigrewrite)
- [StorageConfigRedirect](#gear-storageconfigredirect)
- [StorageConfig](#gear-storageconfig)
- [CliConfig](#gear-cliconfig)
- [SatelliteAssertions](#gear-satelliteassertions)
- [AuthenticationConfigInternetIdentity](#gear-authenticationconfiginternetidentity)
- [AuthenticationConfig](#gear-authenticationconfig)
- [DatastoreConfig](#gear-datastoreconfig)
- [SatelliteId](#gear-satelliteid)
- [SatelliteIds](#gear-satelliteids)
- [SatelliteConfigOptions](#gear-satelliteconfigoptions)
- [JunoConfig](#gear-junoconfig)
- [SatelliteDevCollections](#gear-satellitedevcollections)
- [SatelliteDevController](#gear-satellitedevcontroller)
- [SatelliteDevConfig](#gear-satellitedevconfig)
- [JunoDevConfig](#gear-junodevconfig)

#### :gear: JunoConfigEnv

Represents the environment configuration for Juno.

| Property | Type     | Description                                                |
| -------- | -------- | ---------------------------------------------------------- |
| `mode`   | `string` | The mode of the Juno configuration. type: {JunoConfigMode} |

#### :gear: OrbiterId

Represents the configuration for an orbiter.

| Property | Type     | Description                                                    |
| -------- | -------- | -------------------------------------------------------------- |
| `id`     | `string` | The identifier of the orbiter used in the dApp. type: {string} |

#### :gear: OrbiterIds

Represents a mapping of orbiter identitifiers to different configurations based on the mode of the application.

| Property | Type                     | Description                                                                                                                                                                                                                                                                                                                                            |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ids`    | `Record<string, string>` | A mapping of orbiter identifiers (IDs) to different configurations based on the mode of the application. This allows the application to use different orbiter IDs, such as production, development, etc. Example: { "production": "xo2hm-lqaaa-aaaal-ab3oa-cai", "development": "gl6nx-5maaa-aaaaa-qaaqq-cai" } type: {Record<JunoConfigMode, string>} |

#### :gear: ModuleSettings

Settings for a module - Satellite, Mission Control or Orbiter.

These settings control various aspects of the module's behavior and resource usage.

| Property              | Type                               | Description                                                                                                                                                                                                                             |
| --------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `freezingThreshold`   | `bigint or undefined`              | The cycle threshold below which the module will automatically stop to avoid running out of cycles. For example, if set to `BigInt(1000000)`, the module will stop when it has fewer than 1,000,000 cycles remaining. type: {bigint}     |
| `reservedCyclesLimit` | `bigint or undefined`              | The number of cycles reserved for the module's operations to ensure it has enough cycles to function. For example, setting it to `BigInt(5000000)` reserves 5,000,000 cycles for the module. type: {bigint}                             |
| `logVisibility`       | `ModuleLogVisibility or undefined` | Controls who can see the module's logs. type: {ModuleLogVisibility}                                                                                                                                                                     |
| `heapMemoryLimit`     | `bigint or undefined`              | The maximum amount of WebAssembly (Wasm) memory the module can use on the heap. For example, setting it to `BigInt(1024 * 1024 * 64)` allows the module to use up to 64 MB of Wasm memory. type: {bigint}                               |
| `memoryAllocation`    | `bigint or undefined`              | The amount of memory explicitly allocated to the module. For example, setting it to `BigInt(1024 * 1024 * 128)` allocates 128 MB of memory to the module. type: {bigint}                                                                |
| `computeAllocation`   | `bigint or undefined`              | The proportion of compute capacity allocated to the module. This is a fraction of the total compute capacity of the subnet. For example, setting it to `BigInt(10)` allocates 10% of the compute capacity to the module. type: {bigint} |

#### :gear: MaxMemorySizeConfig

Configuration for granting access to features only if the maximum memory size limits are not reached.

The maximum size corresponds to the overall heap or stable memory of the smart contract.

| Property | Type                  | Description                                                                                                                                           |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heap`   | `bigint or undefined` | Maximum allowed heap memory size in bytes. This field is optional. If not specified, no limit is enforced on the heap memory size. type: {bigint}     |
| `stable` | `bigint or undefined` | Maximum allowed stable memory size in bytes. This field is optional. If not specified, no limit is enforced on the stable memory size. type: {bigint} |

#### :gear: StorageConfigHeader

Headers allow the client and the Storage to pass additional information along with a request or a response.
Some sets of headers can affect how the browser handles the page and its content.

| Property  | Type                 | Description                                                                                                                                                                                                                   |
| --------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`  | `string`             | The glob pattern used to match files within the Storage that these headers will apply to. type: {StorageConfigSourceGlob}                                                                                                     |
| `headers` | `[string, string][]` | An array of key-value pairs representing the headers to apply. Each pair includes the header name and its value. Example: `[["Cache-Control", "max-age=3600"], ["X-Custom-Header", "value"]]` type: {Array<[string, string]>} |

#### :gear: StorageConfigRewrite

You can utilize optional rewrites to display the same content for multiple URLs.
Rewrites are especially useful when combined with pattern matching, allowing acceptance of any URL that matches the pattern.

| Property      | Type     | Description                                                                                                                                           |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`      | `string` | The glob pattern or specific path to match for incoming requests. Matches are rewritten to the specified destination. type: {StorageConfigSourceGlob} |
| `destination` | `string` | The destination path or file to which matching requests should be rewritten. type: {string}                                                           |

#### :gear: StorageConfigRedirect

Use a URL redirect to prevent broken links if you've moved a page or to shorten URLs.

| Property   | Type         | Description                                                                                                                      |
| ---------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `source`   | `string`     | The glob pattern or specific path to match for incoming requests that should be redirected. type: {StorageConfigSourceGlob}      |
| `location` | `string`     | The URL or path to which the request should be redirected. type: {string}                                                        |
| `code`     | `301 or 302` | The HTTP status code to use for the redirect, typically 301 (permanent redirect) or 302 (temporary redirect). type: {301 or 302} |

#### :gear: StorageConfig

Configures the hosting behavior of the Storage.

| Property        | Type                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headers`       | `StorageConfigHeader[] or undefined`                  | Optional array of `StorageConfigHeader` objects to define custom HTTP headers for specific files or patterns. type: {StorageConfigHeader[]}optional                                                                                                                                                                                                                                                                                                                                                                                                               |
| `rewrites`      | `StorageConfigRewrite[] or undefined`                 | Optional array of `StorageConfigRewrite` objects to define rewrite rules. type: {StorageConfigRewrite[]}optional                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `redirects`     | `StorageConfigRedirect[] or undefined`                | Optional array of `StorageConfigRedirect` objects to define HTTP redirects. type: {StorageConfigRedirect[]}optional                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `iframe`        | `"deny" or "same-origin" or "allow-any" or undefined` | For security reasons and to prevent click-jacking attacks, dapps deployed with Juno are, by default, set to deny embedding in other sites. Options are: - `deny`: Prevents any content from being displayed in an iframe. - `same-origin`: Allows iframe content from the same origin as the page. - `allow-any`: Allows iframe content from any origin. If not specified, then `deny` is used as default value. type: {'deny' or 'same-origin' or 'allow-any'}optional                                                                                           |
| `rawAccess`     | `boolean or undefined`                                | Optional flag to enable access for raw URLs. ⚠️ **WARNING: Enabling this option is highly discouraged due to security risks.** Enabling this option allows access to raw URLs (e.g., https://satellite-id.raw.icp0.io), bypassing certificate validation. This creates a security vulnerability where a malicious node in the chain can respond to requests with malicious or invalid content. Since there is no validation on raw URLs, the client may receive and process harmful data. If not specified, the default value is `false`. type: {boolean}optional |
| `maxMemorySize` | `MaxMemorySizeConfig or undefined`                    | Configuration for maximum memory size limits for the Storage. This is used to specify optional limits on heap and stable memory for the smart contract. When the limit is reached, the Storage and smart contract continue to operate normally but reject the upload of new assets. If not specified, no memory limits are enforced. type: {MaxMemorySizeConfig}optional                                                                                                                                                                                          |

#### :gear: CliConfig

| Property     | Type                                    | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`     | `string or undefined`                   | Specifies the directory from which to deploy to Storage. For instance, if `npm run build` outputs files to a `dist` folder, use `source: 'dist'`. default: 'build'type: {string}                                                                                                                                                                                                              |
| `ignore`     | `string[] or undefined`                 | Specifies files or patterns to ignore during deployment, using glob patterns similar to those in .gitignore. type: {string[]}optional                                                                                                                                                                                                                                                         |
| `gzip`       | `string or false or undefined`          | Controls the Gzip compression optimization for files in the source folder. By default, it targets JavaScript (js), ES Module (mjs), and CSS (css) files. You can disable this by setting it to `false` or customize it with a different file matching pattern using glob syntax. type: {string or false}optional                                                                              |
| `encoding`   | `[string, EncodingType][] or undefined` | Customizes file encoding mapping for HTTP response headers `Content-Encoding` based on file extension: - `.Z` for compress, - `.gz` for gzip, - `.br` for brotli, - `.zlib` for deflate, - anything else defaults to `identity`. The "encoding" attribute allows overriding default mappings with an array of glob patterns and encoding types. type: {Array<[string, EncodingType]>}optional |
| `predeploy`  | `string[] or undefined`                 | Defines a list of scripts or commands to be run before the deployment process begins. This can be useful for tasks such as compiling assets, running tests, or building production-ready files. Example: `json { "predeploy": ["npm run build", "npm run lint"] } ` type: {string[]}optional                                                                                                  |
| `postdeploy` | `string[] or undefined`                 | Defines a list of scripts or commands to be run after the deployment process completes. This can be used for tasks such as notifications, cleanup, or sending confirmation messages to services or team members. Example: `json { "postdeploy": ["./scripts/notify-admins.sh", "echo 'Deployment complete'"] } ` type: {string[]}optional                                                     |

#### :gear: SatelliteAssertions

Configuration for satellite assertions.

| Property     | Type                             | Description                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heapMemory` | `number or boolean or undefined` | Configuration for the heap memory size check, which can be: - `true` to enable the check with a default threshold of 900MB, - `false` to disable the heap memory size check, - A `number` to specify a custom threshold in MB (megabytes) for the heap memory size check. If not specified, then `true` is used as the default value. type: {number or boolean} |

#### :gear: AuthenticationConfigInternetIdentity

Configure the behavior of Internet Identity.

| Property                     | Type                    | Description                                                                                                                                                                                                                                                                                                                      |
| ---------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `derivationOrigin`           | `string or undefined`   | This setting ensures that users are recognized on your app, regardless of whether they use the default URL or any other custom domain. For example, if set to hello.com, a user signing on at https://hello.com will receive the same identifier (principal) as when signing on at https://www.hello.com. type: {string}optional |
| `externalAlternativeOrigins` | `string[] or undefined` | An optional list of external alternative origins allowed for authentication, which can be useful if you want to reuse the same derivation origin across multiple Satellites. type: {string[]}optional                                                                                                                            |

#### :gear: AuthenticationConfig

Configures the Authentication options of a Satellite.

| Property           | Type                                                | Description                                                                                                             |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `internetIdentity` | `AuthenticationConfigInternetIdentity or undefined` | Optional configuration of Internet Identity authentication method. type: {AuthenticationConfigInternetIdentity}optional |

#### :gear: DatastoreConfig

Configures the behavior of the Datastore.

| Property        | Type                               | Description                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxMemorySize` | `MaxMemorySizeConfig or undefined` | Configuration for maximum memory size limits for the Datastore. This is used to specify optional limits on heap and stable memory for the smart contract. When the limit is reached, the Datastore and smart contract continue to operate normally but reject the creation or updates of documents. If not specified, no memory limits are enforced. type: {MaxMemorySizeConfig}optional |

#### :gear: SatelliteId

Represents the unique identifier for a satellite.

| Property | Type     | Description                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------- |
| `id`     | `string` | The unique identifier (ID) of the satellite for this application. type: {string} |

#### :gear: SatelliteIds

Represents a mapping of satellite identifiers to different configurations based on the mode of the application.

| Property | Type                     | Description                                                                                                                                                                                                                                                                                                                                        |
| -------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ids`    | `Record<string, string>` | A mapping of satellite identifiers (IDs) to different configurations based on the mode of the application. This allows the application to use different satellite IDs, such as production, staging, etc. Example: { "production": "xo2hm-lqaaa-aaaal-ab3oa-cai", "staging": "gl6nx-5maaa-aaaaa-qaaqq-cai" } type: {Record<JunoConfigMode, string>} |

#### :gear: SatelliteConfigOptions

SatelliteConfigOptions interface provides configuration settings that allow for fine-tuning
the operational behavior of various aspects of a Satellite, such as storage, datastore,
authentication, and deployment assertions.

These options affect specific modules of the Satellite and may require manual application of
changes, typically through CLI commands (e.g., `juno config`).

| Property         | Type                                | Description                                                                                                                                                                                                                                                                 |
| ---------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage`        | `StorageConfig or undefined`        | Optional configuration parameters for the satellite, affecting the operational behavior of its Storage. Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands. type: {StorageConfig}optional               |
| `datastore`      | `DatastoreConfig or undefined`      | Optional configuration parameters for the satellite, affecting the operational behavior of its Datastore. Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands. type: {DatastoreConfig}optional           |
| `authentication` | `AuthenticationConfig or undefined` | Optional configuration parameters for the satellite, affecting the operational behavior of its Authentication. Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands. type: {AuthenticationConfig}optional |
| `assertions`     | `SatelliteAssertions or undefined`  | Optional configurations to override default assertions made by the CLI regarding satellite deployment conditions. type: {SatelliteAssertions}optional                                                                                                                       |
| `settings`       | `ModuleSettings or undefined`       | Optional configuration parameters for the Satellite. These settings control various aspects of the module's behavior and resource usage. type: {ModuleSettings}optional                                                                                                     |

#### :gear: JunoConfig

Represents the overall configuration for Juno.

| Property    | Type                         | Description                                                               |
| ----------- | ---------------------------- | ------------------------------------------------------------------------- |
| `satellite` | `SatelliteConfig`            | The configuration for the satellite. type: {SatelliteConfig}              |
| `orbiter`   | `OrbiterConfig or undefined` | The optional configuration for the orbiter. type: {OrbiterConfig}optional |

#### :gear: SatelliteDevCollections

Represents the collections configuration for a satellite in a development environment.

| Property    | Type                                             | Description                                                                                |
| ----------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `datastore` | `SatelliteDevDataStoreCollection[] or undefined` | The Datastore collections configuration. type: {SatelliteDevDataStoreCollection[]}optional |
| `storage`   | `SatelliteDevStorageCollection[] or undefined`   | The Storage collections configuration. type: {SatelliteDevStorageCollection[]}optional     |

#### :gear: SatelliteDevController

Represents a controller configuration for a satellite in a development environment.

| Property | Type                             | Description                                                           |
| -------- | -------------------------------- | --------------------------------------------------------------------- |
| `id`     | `string`                         | The unique identifier of the controller. type: {string}               |
| `scope`  | `"write" or "admin" or "submit"` | The scope of the controller's permissions. type: {'write' or 'admin'} |

#### :gear: SatelliteDevConfig

Represents the development configuration for a satellite.

| Property      | Type                                    | Description                                                                      |
| ------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| `collections` | `SatelliteDevCollections`               | The collections configuration. type: {SatelliteDevCollections}                   |
| `controllers` | `SatelliteDevController[] or undefined` | The optional controllers configuration. type: {SatelliteDevController[]}optional |

#### :gear: JunoDevConfig

Represents the development configuration for Juno.

| Property    | Type                 | Description                                                                 |
| ----------- | -------------------- | --------------------------------------------------------------------------- |
| `satellite` | `SatelliteDevConfig` | The development configuration for the satellite. type: {SatelliteDevConfig} |

### :cocktail: Types

- [JunoConfigMode](#gear-junoconfigmode)
- [OrbiterConfig](#gear-orbiterconfig)
- [ModuleLogVisibility](#gear-modulelogvisibility)
- [StorageConfigSourceGlob](#gear-storageconfigsourceglob)
- [EncodingType](#gear-encodingtype)
- [SatelliteConfig](#gear-satelliteconfig)
- [SatelliteDevDataStoreCollection](#gear-satellitedevdatastorecollection)
- [SatelliteDevStorageCollection](#gear-satellitedevstoragecollection)
- [JunoDevConfigFn](#gear-junodevconfigfn)
- [JunoDevConfigFnOrObject](#gear-junodevconfigfnorobject)

#### :gear: JunoConfigMode

| Type             | Type                     |
| ---------------- | ------------------------ |
| `JunoConfigMode` | `'production' or string` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L12)

#### :gear: OrbiterConfig

| Type            | Type                            |
| --------------- | ------------------------------- |
| `OrbiterConfig` | `Either<OrbiterId, OrbiterIds>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/orbiter.config.ts#L63)

#### :gear: ModuleLogVisibility

| Type                  | Type                        |
| --------------------- | --------------------------- |
| `ModuleLogVisibility` | `'controllers' or 'public'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/module/module.settings.ts#L16)

#### :gear: StorageConfigSourceGlob

| Type                      | Type |
| ------------------------- | ---- |
| `StorageConfigSourceGlob` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L13)

#### :gear: EncodingType

| Type           | Type                                                      |
| -------------- | --------------------------------------------------------- |
| `EncodingType` | `'identity' or 'gzip' or 'compress' or 'deflate' or 'br'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/encoding.ts#L12)

#### :gear: SatelliteConfig

| Type              | Type                                                                         |
| ----------------- | ---------------------------------------------------------------------------- |
| `SatelliteConfig` | `Either<SatelliteId, SatelliteIds> and CliConfig and SatelliteConfigOptions` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/satellite.config.ts#L149)

#### :gear: SatelliteDevDataStoreCollection

| Type                              | Type                                                                 |
| --------------------------------- | -------------------------------------------------------------------- |
| `SatelliteDevDataStoreCollection` | `Omit< Rule, 'createdAt' or 'updatedAt' or 'maxSize' or 'version' >` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L18)

#### :gear: SatelliteDevStorageCollection

| Type                            | Type                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `SatelliteDevStorageCollection` | `Omit< Rule, 'createdAt' or 'updatedAt' or 'maxCapacity' or 'version' >` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L37)

#### :gear: JunoDevConfigFn

| Type              | Type                  |
| ----------------- | --------------------- |
| `JunoDevConfigFn` | `() => JunoDevConfig` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/config.ts#L3)

#### :gear: JunoDevConfigFnOrObject

| Type                      | Type                               |
| ------------------------- | ---------------------------------- |
| `JunoDevConfigFnOrObject` | `JunoDevConfig or JunoDevConfigFn` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/config.ts#L5)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
