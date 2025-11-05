[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/config
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/config
[npm-license]: https://img.shields.io/npm/l/@junobuild/config
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno Config

Configuration options for [Juno] CLI.

<!-- TSDOC_START -->

### :wrench: Constants

- [SatelliteAssertionsSchema](#gear-satelliteassertionsschema)
- [PermissionTextSchema](#gear-permissiontextschema)
- [MemoryTextSchema](#gear-memorytextschema)
- [RulesTypeSchema](#gear-rulestypeschema)
- [RuleSchema](#gear-ruleschema)
- [DatastoreCollectionSchema](#gear-datastorecollectionschema)
- [StorageCollectionSchema](#gear-storagecollectionschema)
- [CollectionsSchema](#gear-collectionsschema)
- [MaxMemorySizeConfigSchema](#gear-maxmemorysizeconfigschema)
- [DatastoreConfigSchema](#gear-datastoreconfigschema)
- [EmulatorConfigSchema](#gear-emulatorconfigschema)
- [ModuleLogVisibilitySchema](#gear-modulelogvisibilityschema)
- [ModuleSettingsSchema](#gear-modulesettingsschema)
- [JunoConfigModeSchema](#gear-junoconfigmodeschema)
- [JunoConfigEnvSchema](#gear-junoconfigenvschema)
- [OrbiterIdSchema](#gear-orbiteridschema)
- [OrbiterIdsSchema](#gear-orbiteridsschema)
- [OrbiterConfigSchema](#gear-orbiterconfigschema)
- [StorageConfigSourceGlobSchema](#gear-storageconfigsourceglobschema)
- [StorageConfigHeaderSchema](#gear-storageconfigheaderschema)
- [StorageConfigRewriteSchema](#gear-storageconfigrewriteschema)
- [StorageConfigRedirectSchema](#gear-storageconfigredirectschema)
- [StorageConfigSchema](#gear-storageconfigschema)
- [EncodingTypeSchema](#gear-encodingtypeschema)
- [PrecompressSchema](#gear-precompressschema)
- [CliConfigSchema](#gear-cliconfigschema)
- [SatelliteIdSchema](#gear-satelliteidschema)
- [SatelliteIdsSchema](#gear-satelliteidsschema)
- [SatelliteConfigOptionsSchema](#gear-satelliteconfigoptionsschema)

#### :gear: SatelliteAssertionsSchema

| Constant                    | Type                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| `SatelliteAssertionsSchema` | `ZodObject<{ heapMemory: ZodOptional<ZodUnion<readonly [ZodBigInt, ZodBoolean]>>; }, $strict>` |

References:

- SatelliteAssertions

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/assertions.config.ts#L6)

#### :gear: PermissionTextSchema

| Constant               | Type                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `PermissionTextSchema` | `ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>` |

References:

- PermissionText

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/rules.ts#L6)

#### :gear: MemoryTextSchema

| Constant           | Type                                           |
| ------------------ | ---------------------------------------------- |
| `MemoryTextSchema` | `ZodEnum<{ heap: "heap"; stable: "stable"; }>` |

References:

- MemoryText

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/rules.ts#L17)

#### :gear: RulesTypeSchema

| Constant          | Type                                         |
| ----------------- | -------------------------------------------- |
| `RulesTypeSchema` | `ZodEnum<{ db: "db"; storage: "storage"; }>` |

References:

- RulesType

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/rules.ts#L28)

#### :gear: RuleSchema

| Constant     | Type                                                                                                                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RuleSchema` | `ZodObject<{ collection: ZodString; read: ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>; write: ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>; ... 8 more ...; maxTokens: ZodOptional<...>; }, $strict>` |

References:

- Rule

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/rules.ts#L39)

#### :gear: DatastoreCollectionSchema

| Constant                    | Type                                                                                                                                                                                                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DatastoreCollectionSchema` | `ZodObject<{ collection: ZodString; read: ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>; write: ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>; ... 5 more ...; maxTokens: ZodOptional<...>; }, $strict>` |

References:

- DatastoreCollection

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/collections.ts#L7)

#### :gear: StorageCollectionSchema

| Constant                  | Type                                                                                                                                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `StorageCollectionSchema` | `ZodObject<{ collection: ZodString; read: ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>; write: ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>; ... 5 more ...; maxTokens: ZodOptional<...>; }, $strict>` |

References:

- StorageCollection

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/collections.ts#L22)

#### :gear: CollectionsSchema

| Constant            | Type                                                                                                                                                                                                                                                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CollectionsSchema` | `ZodObject<{ datastore: ZodOptional<ZodArray<ZodObject<{ collection: ZodString; read: ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>; write: ZodEnum<{ public: "public"; private: "private"; managed: "managed"; controllers: "controllers"; }>; ... 5 more ...; maxTokens...` |

References:

- Collections

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/collections.ts#L37)

#### :gear: MaxMemorySizeConfigSchema

| Constant                    | Type                                                                                    |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `MaxMemorySizeConfigSchema` | `ZodObject<{ heap: ZodOptional<ZodBigInt>; stable: ZodOptional<ZodBigInt>; }, $strict>` |

References:

- MaxMemorySizeConfig

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/feature.config.ts#L6)

#### :gear: DatastoreConfigSchema

| Constant                | Type                                                                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DatastoreConfigSchema` | `ZodObject<{ maxMemorySize: ZodOptional<ZodObject<{ heap: ZodOptional<ZodBigInt>; stable: ZodOptional<ZodBigInt>; }, $strict>>; version: ZodOptional<...>; }, $strict>` |

References:

- DatastoreConfig

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/datastore.config.ts#L7)

#### :gear: EmulatorConfigSchema

| Constant               | Type                                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EmulatorConfigSchema` | `ZodUnion<readonly [ZodObject<{ runner: ZodOptional<ZodObject<{ type: ZodEnum<{ docker: "docker"; podman: "podman"; }>; image: ZodOptional<ZodString>; name: ZodOptional<ZodString>; volume: ZodOptional<...>; target: ZodOptional<...>; platform: ZodOptional<...>; }, $strict>>; network: ZodOptional<...>; skylab: ZodObjec...` |

References:

- EmulatorConfig

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L249)

#### :gear: ModuleLogVisibilitySchema

| Constant                    | Type                                                         |
| --------------------------- | ------------------------------------------------------------ |
| `ModuleLogVisibilitySchema` | `ZodEnum<{ public: "public"; controllers: "controllers"; }>` |

References:

- ModuleLogVisibility

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/module.settings.ts#L6)

#### :gear: ModuleSettingsSchema

| Constant               | Type                                                                                                                                                                                                                                                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ModuleSettingsSchema` | `ZodObject<{ freezingThreshold: ZodOptional<ZodBigInt>; reservedCyclesLimit: ZodOptional<ZodBigInt>; logVisibility: ZodOptional<ZodEnum<{ public: "public"; controllers: "controllers"; }>>; heapMemoryLimit: ZodOptional<...>; memoryAllocation: ZodOptional<...>; computeAllocation: ZodOptional<...>; }, $strict>` |

References:

- ModuleSettings

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/module.settings.ts#L21)

#### :gear: JunoConfigModeSchema

| Constant               | Type                                                       |
| ---------------------- | ---------------------------------------------------------- |
| `JunoConfigModeSchema` | `ZodUnion<readonly [ZodLiteral<"production">, ZodString]>` |

References:

- JunoConfigMode

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L6)

#### :gear: JunoConfigEnvSchema

| Constant              | Type                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `JunoConfigEnvSchema` | `ZodObject<{ mode: ZodUnion<readonly [ZodLiteral<"production">, ZodString]>; }, $strip>` |

References:

- JunoConfigEnv

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L17)

#### :gear: OrbiterIdSchema

| Constant          | Type                                    |
| ----------------- | --------------------------------------- |
| `OrbiterIdSchema` | `ZodObject<{ id: ZodString; }, $strip>` |

References:

- OrbiterId

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/orbiter.config.ts#L10)

#### :gear: OrbiterIdsSchema

| Constant           | Type                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| `OrbiterIdsSchema` | `ZodObject<{ ids: ZodRecord<ZodUnion<readonly [ZodLiteral<"production">, ZodString]>, ZodString>; }, $strip>` |

References:

- OrbiterIds

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/orbiter.config.ts#L29)

#### :gear: OrbiterConfigSchema

| Constant              | Type                                                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OrbiterConfigSchema` | `ZodUnion<readonly [ZodObject<{ id: ZodString; }, $strict>, ZodObject<{ ids: ZodRecord<ZodUnion<readonly [ZodLiteral<"production">, ZodString]>, ZodString>; }, $strict>]>` |

References:

- OrbiterConfig

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/orbiter.config.ts#L56)

#### :gear: StorageConfigSourceGlobSchema

| Constant                        | Type        |
| ------------------------------- | ----------- |
| `StorageConfigSourceGlobSchema` | `ZodString` |

References:

- StorageConfigSourceGlob

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L7)

#### :gear: StorageConfigHeaderSchema

| Constant                    | Type                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| `StorageConfigHeaderSchema` | `ZodObject<{ source: ZodString; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; }, $strict>` |

References:

- StorageConfigHeader

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L18)

#### :gear: StorageConfigRewriteSchema

| Constant                     | Type                                                                 |
| ---------------------------- | -------------------------------------------------------------------- |
| `StorageConfigRewriteSchema` | `ZodObject<{ source: ZodString; destination: ZodString; }, $strict>` |

References:

- StorageConfigRewrite

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L49)

#### :gear: StorageConfigRedirectSchema

| Constant                      | Type                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `StorageConfigRedirectSchema` | `ZodObject<{ source: ZodString; location: ZodString; code: ZodUnion<readonly [ZodLiteral<301>, ZodLiteral<302>]>; }, $strict>` |

References:

- StorageConfigRedirect

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L79)

#### :gear: StorageConfigSchema

| Constant              | Type                                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StorageConfigSchema` | `ZodObject<{ headers: ZodOptional<ZodArray<ZodObject<{ source: ZodString; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; }, $strict>>>; ... 5 more ...; version: ZodOptional<...>; }, $strip>` |

References:

- StorageConfig

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L114)

#### :gear: EncodingTypeSchema

see EncodingType

| Constant             | Type                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `EncodingTypeSchema` | `ZodEnum<{ identity: "identity"; gzip: "gzip"; compress: "compress"; deflate: "deflate"; br: "br"; }>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/encoding.ts#L6)

#### :gear: PrecompressSchema

| Constant            | Type                                                                                                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PrecompressSchema` | `ZodObject<{ pattern: ZodOptional<ZodString>; mode: ZodOptional<ZodEnum<{ both: "both"; replace: "replace"; }>>; algorithm: ZodOptional<ZodEnum<{ gzip: "gzip"; brotli: "brotli"; }>>; }, $strict>` |

References:

- Precompress

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/cli.config.ts#L7)

#### :gear: CliConfigSchema

| Constant          | Type                                                                                                                                                                                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CliConfigSchema` | `ZodObject<{ source: ZodOptional<ZodString>; ignore: ZodOptional<ZodArray<ZodString>>; precompress: ZodOptional<ZodUnion<readonly [ZodObject<{ pattern: ZodOptional<ZodString>; mode: ZodOptional<...>; algorithm: ZodOptional<...>; }, $strict>, ZodArray<...>, ZodLiteral<...>]>>; encoding: ZodOptional<...>; predeploy: Zo...` |

References:

- CliConfig

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/cli.config.ts#L16)

#### :gear: SatelliteIdSchema

| Constant            | Type                                    |
| ------------------- | --------------------------------------- |
| `SatelliteIdSchema` | `ZodObject<{ id: ZodString; }, $strip>` |

References:

- SatelliteId

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/satellite.config.ts#L20)

#### :gear: SatelliteIdsSchema

| Constant             | Type                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `SatelliteIdsSchema` | `ZodObject<{ ids: ZodRecord<ZodUnion<readonly [ZodLiteral<"production">, ZodString]>, ZodString>; }, $strip>` |

References:

- SatelliteIds

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/satellite.config.ts#L39)

#### :gear: SatelliteConfigOptionsSchema

| Constant                       | Type                                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SatelliteConfigOptionsSchema` | `ZodUnion<readonly [ZodObject<{ storage: ZodOptional<ZodObject<{ headers: ZodOptional<ZodArray<ZodObject<{ source: ZodString; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; }, $strict>>>; ... 5 more ...; version: ZodOptional<...>; }, $strip>>; ... 5 more ...; id: ZodString; }, $strict>, ZodObject<...>]>` |

References:

- JunoConsoleConfig

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/satellite.config.ts#L78)

### :tropical_drink: Interfaces

- [SatelliteAssertions](#gear-satelliteassertions)
- [Rule](#gear-rule)
- [Collections](#gear-collections)
- [MaxMemorySizeConfig](#gear-maxmemorysizeconfig)
- [DatastoreConfig](#gear-datastoreconfig)
- [EmulatorPorts](#gear-emulatorports)
- [EmulatorSkylab](#gear-emulatorskylab)
- [EmulatorConsole](#gear-emulatorconsole)
- [EmulatorSatellite](#gear-emulatorsatellite)
- [EmulatorRunner](#gear-emulatorrunner)
- [NetworkServices](#gear-networkservices)
- [Network](#gear-network)
- [ModuleSettings](#gear-modulesettings)
- [JunoConfigEnv](#gear-junoconfigenv)
- [OrbiterId](#gear-orbiterid)
- [OrbiterIds](#gear-orbiterids)
- [StorageConfigHeader](#gear-storageconfigheader)
- [StorageConfigRewrite](#gear-storageconfigrewrite)
- [StorageConfigRedirect](#gear-storageconfigredirect)
- [StorageConfig](#gear-storageconfig)
- [Precompress](#gear-precompress)
- [CliConfig](#gear-cliconfig)
- [SatelliteId](#gear-satelliteid)
- [SatelliteIds](#gear-satelliteids)
- [SatelliteConfigOptions](#gear-satelliteconfigoptions)

#### :gear: SatelliteAssertions

Configuration for satellite assertions.

| Property     | Type                             | Description                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heapMemory` | `bigint or boolean or undefined` | Configuration for the heap memory size check, which can be: - `true` to enable the check with a default threshold of 900MB, - `false` to disable the heap memory size check, - A `bigint` to specify a custom threshold in MB (megabytes) for the heap memory size check. If not specified, then `true` is used as the default value. type: {bigint or boolean} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/assertions.config.ts#L14)

#### :gear: Rule

Represents a rule configuration for a collection.

| Property             | Type                   | Description                                                                                                                                         |
| -------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `collection`         | `string`               | The name of the collection the rule applies to. type: {string}                                                                                      |
| `read`               | `PermissionText`       | The permission level for read access. type: {PermissionText}                                                                                        |
| `write`              | `PermissionText`       | The permission level for write access. type: {PermissionText}                                                                                       |
| `memory`             | `MemoryText`           | The type of memory allocated for the collection. type: {MemoryText}                                                                                 |
| `createdAt`          | `bigint or undefined`  | The timestamp when the rule was created. type: {bigint}optional                                                                                     |
| `updatedAt`          | `bigint or undefined`  | The timestamp when the rule was last updated. type: {bigint}optional                                                                                |
| `version`            | `bigint or undefined`  | The version of the rule. type: {bigint}optionaldescription: Must be provided when updating the rule to ensure the correct version is being updated. |
| `maxSize`            | `bigint or undefined`  | The maximum size of the collection in bytes. type: {number}optional                                                                                 |
| `maxChangesPerUser`  | `number or undefined`  | The maximum number of changes (create, update or delete) per user for the collection. type: {number}optional                                        |
| `maxCapacity`        | `number or undefined`  | The maximum capacity of the collection. type: {number}optional                                                                                      |
| `mutablePermissions` | `boolean or undefined` | Indicates whether the permissions are mutable. default: truetype: {boolean}                                                                         |
| `maxTokens`          | `bigint or undefined`  | The maximum number of writes and deletes per minute.                                                                                                |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/rules.ts#L58)

#### :gear: Collections

Represents the configuration for all the collections of a Satellite.

| Property    | Type                                 | Description                                                                                            |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `datastore` | `DatastoreCollection[] or undefined` | An optional array that defines the collections of the Datastore. type: {DatastoreCollection[]}optional |
| `storage`   | `StorageCollection[] or undefined`   | An optional array that defines the collections of the Storage. type: {StorageCollection[]}optional     |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/collections.ts#L46)

#### :gear: MaxMemorySizeConfig

Configuration for granting access to features only if the maximum memory size limits are not reached.

The maximum size corresponds to the overall heap or stable memory of the smart contract.

| Property | Type                  | Description                                                                                                                                           |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heap`   | `bigint or undefined` | Maximum allowed heap memory size in bytes. This field is optional. If not specified, no limit is enforced on the heap memory size. type: {bigint}     |
| `stable` | `bigint or undefined` | Maximum allowed stable memory size in bytes. This field is optional. If not specified, no limit is enforced on the stable memory size. type: {bigint} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/feature.config.ts#L18)

#### :gear: DatastoreConfig

Configures the behavior of the Datastore.

| Property        | Type                               | Description                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxMemorySize` | `MaxMemorySizeConfig or undefined` | Configuration for maximum memory size limits for the Datastore. This is used to specify optional limits on heap and stable memory for the smart contract. When the limit is reached, the Datastore and smart contract continue to operate normally but reject the creation or updates of documents. If not specified, no memory limits are enforced. type: {MaxMemorySizeConfig}optional |
| `version`       | `bigint or undefined`              | The current version of the config. Optional. The CLI will automatically resolve the version and warn you if there's a potential overwrite. You can provide it if you want to manage versioning manually within your config file. type: {bigint}optional                                                                                                                                  |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/datastore.config.ts#L16)

#### :gear: EmulatorPorts

Represents the ports exposed by an emulator container.

| Property           | Type                  | Description                                                                                                                                                                          |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `server`           | `number or undefined` | The port of the server used to simulate execution. This is the port your app connects to. Also known as the "local Internet Computer replica" or the "Pocket-IC port". default: 5987 |
| `admin`            | `number or undefined` | The port of the admin server used for tasks like transferring ICP from the ledger. default: 5999                                                                                     |
| `timeoutInSeconds` | `number or undefined` | Max number of seconds to wait for emulator ports to become ready. default: 30                                                                                                        |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L32)

#### :gear: EmulatorSkylab

Configuration for the Skylab emulator.

| Property | Type                                                    | Description                            |
| -------- | ------------------------------------------------------- | -------------------------------------- |
| `ports`  | `(EmulatorPorts and { console: number; }) or undefined` | Ports exposed by the Skylab container. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L63)

#### :gear: EmulatorConsole

Configuration for the Console emulator.

| Property | Type                         | Description                             |
| -------- | ---------------------------- | --------------------------------------- |
| `ports`  | `EmulatorPorts or undefined` | Ports exposed by the Console container. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L86)

#### :gear: EmulatorSatellite

Configuration for the Satellite emulator.

| Property | Type                         | Description                               |
| -------- | ---------------------------- | ----------------------------------------- |
| `ports`  | `EmulatorPorts or undefined` | Ports exposed by the Satellite container. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L103)

#### :gear: EmulatorRunner

Shared options for all runner variants.

| Property   | Type                                          | Description                                                                                           |
| ---------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `type`     | `"docker" or "podman"`                        | The containerization tool to run the emulator.                                                        |
| `image`    | `string or undefined`                         | Image reference. default: depends on emulator type, e.g. "junobuild/skylab:latest"                    |
| `name`     | `string or undefined`                         | Optional container name to use for the emulator. Useful for reusing or managing a specific container. |
| `volume`   | `string or undefined`                         | Persistent volume to store internal state. default: "juno"                                            |
| `target`   | `string or undefined`                         | Shared folder for deploying and hot-reloading serverless functions.                                   |
| `platform` | `"linux/amd64" or "linux/arm64" or undefined` | The platform to use when running the emulator container.                                              |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L125)

#### :gear: NetworkServices

Network services that can be enabled in the emulator.

Each flag corresponds to a system canister or application that can be included
in the local Internet Computer network when the emulator starts.

| Property            | Type                   | Description                                                                                                                                                                                                              |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `registry`          | `boolean or undefined` | Registry canister: Stores network configuration and topology (subnet membership, public keys, feature flags). Acts as the source of truth other system canisters read/write to.                                          |
| `cmc`               | `boolean or undefined` | CMC (Cycles Minting Canister): Converts ICP to cycles and distributes them; maintains subnet lists and conversion rate. Requires icp and nns to not be enabled.                                                          |
| `icp`               | `boolean or undefined` | ICP token: Deploys the ICP ledger and index canisters.                                                                                                                                                                   |
| `cycles`            | `boolean or undefined` | Cycles token: Deploys the cycles ledger and index canisters.                                                                                                                                                             |
| `nns`               | `boolean or undefined` | NNS governance canisters: Deploys the governance and root canisters. Core governance system (neurons, proposals, voting) and related control logic. Enables managing network-level decisions in an emulated environment. |
| `sns`               | `boolean or undefined` | SNS canisters: Deploys the SNS-W and aggregator canisters. Service Nervous System stack used to govern individual dapps.                                                                                                 |
| `internet_identity` | `boolean or undefined` | Internet Identity: Deploys the II canister for authentication.                                                                                                                                                           |
| `nns_dapp`          | `boolean or undefined` | NNS dapp: Deploys the NNS UI canister and frontend application Requires cmc, icp, nns, sns, internet_identity to be enabled.                                                                                             |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L180)

#### :gear: Network

Configuration for customizing the Internet Computer network bootstrapped
by the emulator.

| Property   | Type              | Description                                                 |
| ---------- | ----------------- | ----------------------------------------------------------- |
| `services` | `NetworkServices` | System canisters and applications available in the network. |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L239)

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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/module.settings.ts#L37)

#### :gear: JunoConfigEnv

Represents the environment configuration for Juno.

| Property | Type     | Description                                                |
| -------- | -------- | ---------------------------------------------------------- |
| `mode`   | `string` | The mode of the Juno configuration. type: {JunoConfigMode} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L25)

#### :gear: OrbiterId

Represents the configuration for an orbiter.

| Property | Type     | Description                                                    |
| -------- | -------- | -------------------------------------------------------------- |
| `id`     | `string` | The identifier of the orbiter used in the dApp. type: {string} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/orbiter.config.ts#L18)

#### :gear: OrbiterIds

Represents a mapping of orbiter identitifiers to different configurations based on the mode of the application.

| Property | Type                     | Description                                                                                                                                                                                                                                                                                                                                            |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ids`    | `Record<string, string>` | A mapping of orbiter identifiers (IDs) to different configurations based on the mode of the application. This allows the application to use different orbiter IDs, such as production, development, etc. Example: { "production": "xo2hm-lqaaa-aaaal-ab3oa-cai", "development": "gl6nx-5maaa-aaaaa-qaaqq-cai" } type: {Record<JunoConfigMode, string>} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/orbiter.config.ts#L37)

#### :gear: StorageConfigHeader

Headers allow the client and the Storage to pass additional information along with a request or a response.
Some sets of headers can affect how the browser handles the page and its content.

| Property  | Type                 | Description                                                                                                                                                                                                                   |
| --------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`  | `string`             | The glob pattern used to match files within the Storage that these headers will apply to. type: {StorageConfigSourceGlob}                                                                                                     |
| `headers` | `[string, string][]` | An array of key-value pairs representing the headers to apply. Each pair includes the header name and its value. Example: `[["Cache-Control", "max-age=3600"], ["X-Custom-Header", "value"]]` type: {Array<[string, string]>} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L30)

#### :gear: StorageConfigRewrite

You can utilize optional rewrites to display the same content for multiple URLs.
Rewrites are especially useful when combined with pattern matching, allowing acceptance of any URL that matches the pattern.

| Property      | Type     | Description                                                                                                                                           |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`      | `string` | The glob pattern or specific path to match for incoming requests. Matches are rewritten to the specified destination. type: {StorageConfigSourceGlob} |
| `destination` | `string` | The destination path or file to which matching requests should be rewritten. type: {string}                                                           |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L61)

#### :gear: StorageConfigRedirect

Use a URL redirect to prevent broken links if you've moved a page or to shorten URLs.

| Property   | Type         | Description                                                                                                                      |
| ---------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `source`   | `string`     | The glob pattern or specific path to match for incoming requests that should be redirected. type: {StorageConfigSourceGlob}      |
| `location` | `string`     | The URL or path to which the request should be redirected. type: {string}                                                        |
| `code`     | `301 or 302` | The HTTP status code to use for the redirect, typically 301 (permanent redirect) or 302 (temporary redirect). type: {301 or 302} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L91)

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
| `version`       | `bigint or undefined`                                 | The current version of the config. Optional. The CLI will automatically resolve the version and warn you if there's a potential overwrite. You can provide it if you want to manage versioning manually within your config file. type: {bigint}optional                                                                                                                                                                                                                                                                                                           |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L128)

#### :gear: Precompress

Configuration for compressing files during deployment.

| Property    | Type                               | Description                                                                                                                                                                                                                      |
| ----------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --- | ---- |
| `pattern`   | `string or undefined`              | Glob pattern for files to precompress. default: any css                                                                                                                                                                          | js  | mjs | html |
| `mode`      | `"both" or "replace" or undefined` | Determines what happens to the original files after compression: - `"both"` — upload both original and compressed versions. - `"replace"` — upload only the compressed version (served with `Content-Encoding`). default: "both" |
| `algorithm` | `"gzip" or "brotli" or undefined`  | Compression algorithm. default: "gzip"                                                                                                                                                                                           |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/cli.config.ts#L30)

#### :gear: CliConfig

The configuration used by the CLI to resolve, prepare and deploy your app.

| Property      | Type                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`      | `string or undefined`                                | Specifies the directory from which to deploy to Storage. For instance, if `npm run build` outputs files to a `dist` folder, use `source: 'dist'`. default: 'build'type: {string}                                                                                                                                                                                                              |
| `ignore`      | `string[] or undefined`                              | Specifies files or patterns to ignore during deployment, using glob patterns similar to those in .gitignore. type: {string[]}optional                                                                                                                                                                                                                                                         |
| `precompress` | `false or Precompress or Precompress[] or undefined` | Controls compression optimization for files in the source folder. By default, JavaScript (.js), ES Modules (.mjs), CSS (.css), and HTML (.html) are compressed, and both the original and compressed versions are uploaded. Set to `false` to disable, or provide one or more {@link Precompress} objects to customize. type: {Precompress or Precompress[] or false}optional                 |
| `encoding`    | `[string, EncodingType][] or undefined`              | Customizes file encoding mapping for HTTP response headers `Content-Encoding` based on file extension: - `.Z` for compress, - `.gz` for gzip, - `.br` for brotli, - `.zlib` for deflate, - anything else defaults to `identity`. The "encoding" attribute allows overriding default mappings with an array of glob patterns and encoding types. type: {Array<[string, EncodingType]>}optional |
| `predeploy`   | `string[] or undefined`                              | Defines a list of scripts or commands to be run before the deployment process begins. This can be useful for tasks such as compiling assets, running tests, or building production-ready files. Example: `json { "predeploy": ["npm run build", "npm run lint"] } ` type: {string[]}optional                                                                                                  |
| `postdeploy`  | `string[] or undefined`                              | Defines a list of scripts or commands to be run after the deployment process completes. This can be used for tasks such as notifications, cleanup, or sending confirmation messages to services or team members. Example: `json { "postdeploy": ["./scripts/notify-admins.sh", "echo 'Deployment complete'"] } ` type: {string[]}optional                                                     |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/cli.config.ts#L56)

#### :gear: SatelliteId

Represents the unique identifier for a satellite.

| Property | Type     | Description                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------- |
| `id`     | `string` | The unique identifier (ID) of the satellite for this application. type: {string} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/satellite.config.ts#L28)

#### :gear: SatelliteIds

Represents a mapping of satellite identifiers to different configurations based on the mode of the application.

| Property | Type                     | Description                                                                                                                                                                                                                                                                                                                                        |
| -------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ids`    | `Record<string, string>` | A mapping of satellite identifiers (IDs) to different configurations based on the mode of the application. This allows the application to use different satellite IDs, such as production, staging, etc. Example: { "production": "xo2hm-lqaaa-aaaal-ab3oa-cai", "staging": "gl6nx-5maaa-aaaaa-qaaqq-cai" } type: {Record<JunoConfigMode, string>} |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/satellite.config.ts#L47)

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
| `collections`    | `Collections or undefined`          | Optional configuration for the Datastore and Storage collections. type: {Collections}optional                                                                                                                                                                               |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/satellite.config.ts#L109)

### :cocktail: Types

- [PermissionText](#gear-permissiontext)
- [MemoryText](#gear-memorytext)
- [RulesType](#gear-rulestype)
- [DatastoreCollection](#gear-datastorecollection)
- [StorageCollection](#gear-storagecollection)
- [EmulatorConfig](#gear-emulatorconfig)
- [ModuleLogVisibility](#gear-modulelogvisibility)
- [JunoConfigMode](#gear-junoconfigmode)
- [OrbiterConfig](#gear-orbiterconfig)
- [StorageConfigSourceGlob](#gear-storageconfigsourceglob)
- [EncodingType](#gear-encodingtype)
- [SatelliteConfig](#gear-satelliteconfig)

#### :gear: PermissionText

| Type             | Type                                                  |
| ---------------- | ----------------------------------------------------- |
| `PermissionText` | `'public' or 'private' or 'managed' or 'controllers'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/rules.ts#L12)

#### :gear: MemoryText

| Type         | Type                 |
| ------------ | -------------------- |
| `MemoryText` | `'heap' or 'stable'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/rules.ts#L23)

#### :gear: RulesType

| Type        | Type                |
| ----------- | ------------------- |
| `RulesType` | `'db' or 'storage'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/rules.ts#L34)

#### :gear: DatastoreCollection

| Type                  | Type                                                  |
| --------------------- | ----------------------------------------------------- |
| `DatastoreCollection` | `Omit<Rule, 'createdAt' or 'updatedAt' or 'maxSize'>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/collections.ts#L17)

#### :gear: StorageCollection

| Type                | Type                                                      |
| ------------------- | --------------------------------------------------------- |
| `StorageCollection` | `Omit<Rule, 'createdAt' or 'updatedAt' or 'maxCapacity'>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/collections.ts#L32)

#### :gear: EmulatorConfig

The configuration for running the Juno emulator.

| Type             | Type |
| ---------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EmulatorConfig` | `    | {runner?: EmulatorRunner; network?: Network; skylab: EmulatorSkylab} or {runner?: EmulatorRunner; network?: Network; console: EmulatorConsole} or {runner?: EmulatorRunner; network?: Network; satellite: EmulatorSatellite}` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/emulator.config.ts#L272)

#### :gear: ModuleLogVisibility

| Type                  | Type                        |
| --------------------- | --------------------------- |
| `ModuleLogVisibility` | `'controllers' or 'public'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/module.settings.ts#L16)

#### :gear: JunoConfigMode

| Type             | Type                     |
| ---------------- | ------------------------ |
| `JunoConfigMode` | `'production' or string` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L12)

#### :gear: OrbiterConfig

| Type            | Type                            |
| --------------- | ------------------------------- |
| `OrbiterConfig` | `Either<OrbiterId, OrbiterIds>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/orbiter.config.ts#L64)

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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/configs/satellite.config.ts#L165)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
