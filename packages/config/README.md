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

### :tropical_drink: Interfaces

- [OrbiterConfig](#gear-orbiterconfig)
- [ModuleSettings](#gear-modulesettings)
- [CliConfig](#gear-cliconfig)
- [JunoConfigEnv](#gear-junoconfigenv)
- [SatelliteAssertions](#gear-satelliteassertions)
- [AuthenticationConfigInternetIdentity](#gear-authenticationconfiginternetidentity)
- [AuthenticationConfig](#gear-authenticationconfig)
- [SatelliteId](#gear-satelliteid)
- [SatelliteIds](#gear-satelliteids)
- [JunoConfig](#gear-junoconfig)
- [SatelliteDevCollections](#gear-satellitedevcollections)
- [SatelliteDevController](#gear-satellitedevcontroller)
- [SatelliteDevConfig](#gear-satellitedevconfig)
- [JunoDevConfig](#gear-junodevconfig)

#### :gear: OrbiterConfig

Represents the configuration for an orbiter.

| Property    | Type                  | Description                                                                                                                      |
| ----------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`              | The identifier of the orbiter used in the dApp. type: {string}                                                                   |
| `orbiterId` | `string or undefined` | The deprecated identifier of the orbiter. deprecated: `orbiterId` will be removed in the future. Use `id` instead.type: {string} |

#### :gear: ModuleSettings

Settings for a module - Satellite, Mission Control or Orbiter.

These settings control various aspects of the module's behavior and resource usage.

| Property              | Type                               | Description                                                                                                                                                                                                                            |
| --------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `freezingThreshold`   | `bigint or undefined`              | The cycle threshold below which the module will automatically stop to avoid running out of cycles.For example, if set to `BigInt(1000000)`, the module will stop when it has fewer than 1,000,000 cycles remaining. type: {bigint}     |
| `reservedCyclesLimit` | `bigint or undefined`              | The number of cycles reserved for the module's operations to ensure it has enough cycles to function.For example, setting it to `BigInt(5000000)` reserves 5,000,000 cycles for the module. type: {bigint}                             |
| `logVisibility`       | `ModuleLogVisibility or undefined` | Controls who can see the module's logs. type: {ModuleLogVisibility}                                                                                                                                                                    |
| `heapMemoryLimit`     | `bigint or undefined`              | The maximum amount of WebAssembly (Wasm) memory the module can use on the heap.For example, setting it to `BigInt(1024 * 1024 * 64)` allows the module to use up to 64 MB of Wasm memory. type: {bigint}                               |
| `memoryAllocation`    | `bigint or undefined`              | The amount of memory explicitly allocated to the module.For example, setting it to `BigInt(1024 * 1024 * 128)` allocates 128 MB of memory to the module. type: {bigint}                                                                |
| `computeAllocation`   | `bigint or undefined`              | The proportion of compute capacity allocated to the module.This is a fraction of the total compute capacity of the subnet. For example, setting it to `BigInt(10)` allocates 10% of the compute capacity to the module. type: {bigint} |

#### :gear: CliConfig

| Property   | Type                                     | Description                                                                                                                                                                                                                                                                                                                                                                              |
| ---------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `source`   | `string or undefined`                    | Specifies the directory from which to deploy to storage.For instance, if `npm run build` outputs files to a `dist` folder, use `source: 'dist'`. default: 'build'type: {string}                                                                                                                                                                                                          |
| `ignore`   | `string[] or undefined`                  | Specifies files or patterns to ignore during deployment, using glob patterns similar to those in .gitignore. type: {string[]}optional                                                                                                                                                                                                                                                    |
| `gzip`     | `string or false or undefined`           | Controls the Gzip compression optimization for files in the source folder. By default, it targets JavaScript (js), ES Module (mjs), and CSS (css) files.You can disable this by setting it to `false` or customize it with a different file matching pattern using glob syntax. type: {string                                                                                            | false}optional |
| `encoding` | `[string, ENCODING_TYPE][] or undefined` | Customizes file encoding mapping for HTTP response headers `Content-Encoding` based on file extension:- `.Z` for compress,- `.gz` for gzip,- `.br` for brotli,- `.zlib` for deflate,- anything else defaults to `identity`.The "encoding" attribute allows overriding default mappings with an array of glob patterns and encoding types. type: {Array<[string, ENCODING_TYPE]>}optional |

#### :gear: JunoConfigEnv

Represents the environment configuration for Juno.

| Property | Type     | Description                                                |
| -------- | -------- | ---------------------------------------------------------- |
| `mode`   | `string` | The mode of the Juno configuration. type: {JunoConfigMode} |

#### :gear: SatelliteAssertions

Configuration for satellite assertions.

| Property     | Type                             | Description                                                                                                                                                                                                                                                                                                                                     |
| ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `heapMemory` | `number or boolean or undefined` | Configuration for the heap memory size check, which can be:- `true` to enable the check with a default threshold of 900MB,- `false` to disable the heap memory size check,- A `number` to specify a custom threshold in MB (megabytes) for the heap memory size check.If not specified, then `true` is used as the default value. type: {number | boolean} |

#### :gear: AuthenticationConfigInternetIdentity

Configure the behavior of Internet Identity.

| Property           | Type                  | Description                                                                                                                                                                                                                                                                                                                     |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `derivationOrigin` | `string or undefined` | This setting ensures that users are recognized on your app, regardless of whether they use the default URL or any other custom domain.For example, if set to hello.com, a user signing on at https://hello.com will receive the same identifier (principal) as when signing on at https://www.hello.com. type: {string}optional |

#### :gear: AuthenticationConfig

Configures the Authentication options of a Satellite.

| Property           | Type                                                | Description                                                                                                             |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `internetIdentity` | `AuthenticationConfigInternetIdentity or undefined` | Optional configuration of Internet Identity authentication method. type: {AuthenticationConfigInternetIdentity}optional |

#### :gear: SatelliteId

Represents the unique identifier for a satellite.

| Property      | Type                  | Description                                                                                                                                      |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`          | `string`              | The unique identifier (ID) of the satellite for this application. type: {string}                                                                 |
| `satelliteId` | `string or undefined` | The deprecated unique identifier (ID) of the satellite. deprecated: `satelliteId` will be removed in the future. Use `id` instead.type: {string} |

#### :gear: SatelliteIds

Represents a mapping of satellite identifiers to different configurations based on the mode of the application.

| Property | Type                     | Description                                                                                                                                                                                                                                                                                                                                    |
| -------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ids`    | `Record<string, string>` | A mapping of satellite identifiers (IDs) to different configurations based on the mode of the application.This allows the application to use different satellite IDs, such as production, staging, etc.Example:{ "production": "xo2hm-lqaaa-aaaal-ab3oa-cai", "staging": "gl6nx-5maaa-aaaaa-qaaqq-cai"} type: {Record<JunoConfigMode, string>} |

#### :gear: JunoConfig

Represents the overall configuration for Juno.

| Property    | Type                         | Description                                                               |
| ----------- | ---------------------------- | ------------------------------------------------------------------------- |
| `satellite` | `SatelliteConfig`            | The configuration for the satellite. type: {SatelliteConfig}              |
| `orbiter`   | `OrbiterConfig or undefined` | The optional configuration for the orbiter. type: {OrbiterConfig}optional |

#### :gear: SatelliteDevCollections

Represents the collections configuration for a satellite in a development environment.

| Property    | Type                                             | Description                                                                                                                                      |
| ----------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `datastore` | `SatelliteDevDataStoreCollection[] or undefined` | The datastore collections configuration. type: {SatelliteDevDataStoreCollection[]}optional                                                       |
| `db`        | `SatelliteDevDataStoreCollection[] or undefined` | The datastore collections configuration.This property is deprecated. Use {@link datastore} instead. deprecatedtype: {SatelliteDevDbCollection[]} |
| `storage`   | `SatelliteDevStorageCollection[] or undefined`   | The storage collections configuration. type: {SatelliteDevStorageCollection[]}optional                                                           |

#### :gear: SatelliteDevController

Represents a controller configuration for a satellite in a development environment.

| Property | Type                 | Description                                               |
| -------- | -------------------- | --------------------------------------------------------- | -------- |
| `id`     | `string`             | The unique identifier of the controller. type: {string}   |
| `scope`  | `"write" or "admin"` | The scope of the controller's permissions. type: {'write' | 'admin'} |

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

- [ModuleLogVisibility](#gear-modulelogvisibility)
- [ENCODING_TYPE](#gear-encoding_type)
- [JunoConfigMode](#gear-junoconfigmode)
- [SatelliteConfig](#gear-satelliteconfig)
- [SatelliteDevDataStoreCollection](#gear-satellitedevdatastorecollection)
- [SatelliteDevDbCollection](#gear-satellitedevdbcollection)
- [SatelliteDevStorageCollection](#gear-satellitedevstoragecollection)
- [JunoDevConfigFn](#gear-junodevconfigfn)
- [JunoDevConfigFnOrObject](#gear-junodevconfigfnorobject)

#### :gear: ModuleLogVisibility

| Type                  | Type                        |
| --------------------- | --------------------------- |
| `ModuleLogVisibility` | `'controllers' or 'public'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/module/module.settings.ts#L9)

#### :gear: ENCODING_TYPE

| Type            | Type                                                      |
| --------------- | --------------------------------------------------------- |
| `ENCODING_TYPE` | `'identity' or 'gzip' or 'compress' or 'deflate' or 'br'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/encoding.ts#L5)

#### :gear: JunoConfigMode

| Type             | Type                     |
| ---------------- | ------------------------ |
| `JunoConfigMode` | `'production' or string` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L5)

#### :gear: SatelliteConfig

| Type              | Type                                 |
| ----------------- | ------------------------------------ |
| `SatelliteConfig` | `Either<SatelliteId, SatelliteIds> & |

CliConfig and {
/\*\*
_ Optional configuration parameters for the satellite, affecting the operational behavior of its Storage.
_ Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands.
_ @type {StorageConfig}
_ @optional
\*/
storage?: StorageConfig;

    /**
     * Optional configuration parameters for the satellite, affecting the operational behavior of its Datastore.
     * Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands.
     * @type {DatastoreConfig}
     * @optional
     */
    datastore?: DatastoreConfig;

    /**
     * Optional configuration parameters for the satellite, affecting the operational behavior of its Authentication.
     * Changes to these parameters must be applied manually afterwards, for example with the CLI using `juno config` commands.
     * @type {AuthenticationConfig}
     * @optional
     */
    authentication?: AuthenticationConfig;

    /**
     * Optional configurations to override default assertions made by the CLI regarding satellite deployment conditions.
     * @type {SatelliteAssertions}
     * @optional
     */
    assertions?: SatelliteAssertions;

    /**
     * Optional configuration parameters for the Satellite.
     * These settings control various aspects of the module's behavior and resource usage.
     * @type {ModuleSettings}
     * @optional
     */
    settings?: ModuleSettings;

}` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/mainnet/configs/satellite.config.ts#L53)

#### :gear: SatelliteDevDataStoreCollection

| Type                              | Type   |
| --------------------------------- | ------ |
| `SatelliteDevDataStoreCollection` | `Omit< |

Rule,
'createdAt' or 'updatedAt' or 'maxSize' or 'version'

> ` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L7)

#### :gear: SatelliteDevDbCollection

| Type                       | Type                              |
| -------------------------- | --------------------------------- |
| `SatelliteDevDbCollection` | `SatelliteDevDataStoreCollection` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L19)

#### :gear: SatelliteDevStorageCollection

| Type                            | Type   |
| ------------------------------- | ------ |
| `SatelliteDevStorageCollection` | `Omit< |

Rule,
'createdAt' or 'updatedAt' or 'maxCapacity' or 'version'

> ` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/satellite/dev/juno.dev.config.ts#L25)

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
