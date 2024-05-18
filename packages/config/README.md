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

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/dev/config.ts#L7)

#### :gear: defineDevConfig

| Function          | Type                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineDevConfig` | `{ (config: JunoDevConfig): JunoDevConfig; (config: JunoDevConfigFn): JunoDevConfigFn; (config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/dev/config.ts#L8)

#### :gear: defineDevConfig

| Function          | Type                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineDevConfig` | `{ (config: JunoDevConfig): JunoDevConfig; (config: JunoDevConfigFn): JunoDevConfigFn; (config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/dev/config.ts#L9)

#### :gear: defineDevConfig

| Function          | Type                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defineDevConfig` | `{ (config: JunoDevConfig): JunoDevConfig; (config: JunoDevConfigFn): JunoDevConfigFn; (config: JunoDevConfigFnOrObject): JunoDevConfigFnOrObject; }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/dev/config.ts#L10)

### :tropical_drink: Interfaces

- [JunoConfigEnv](#gear-junoconfigenv)
- [OrbiterConfig](#gear-orbiterconfig)
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

#### :gear: OrbiterConfig

Represents the configuration for an orbiter.

| Property    | Type                  | Description                                                                                                                      |
| ----------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string`              | The identifier of the orbiter used in the dApp. type: {string}                                                                   |
| `orbiterId` | `string or undefined` | The deprecated identifier of the orbiter. deprecated: `orbiterId` will be removed in the future. Use `id` instead.type: {string} |

#### :gear: JunoConfig

Represents the overall configuration for Juno.

| Property    | Type                         | Description                                                               |
| ----------- | ---------------------------- | ------------------------------------------------------------------------- |
| `satellite` | `SatelliteConfig`            | The configuration for the satellite. type: {SatelliteConfig}              |
| `orbiter`   | `OrbiterConfig or undefined` | The optional configuration for the orbiter. type: {OrbiterConfig}optional |

#### :gear: SatelliteDevCollections

Represents the collections configuration for a satellite in a development environment.

| Property  | Type                                           | Description                                                                            |
| --------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| `db`      | `SatelliteDevDbCollection[] or undefined`      | The database collections configuration. type: {SatelliteDevDbCollection[]}optional     |
| `storage` | `SatelliteDevStorageCollection[] or undefined` | The storage collections configuration. type: {SatelliteDevStorageCollection[]}optional |

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

- [ENCODING_TYPE](#gear-encoding_type)
- [JunoConfigMode](#gear-junoconfigmode)
- [SatelliteDevDbCollection](#gear-satellitedevdbcollection)
- [SatelliteDevStorageCollection](#gear-satellitedevstoragecollection)
- [JunoDevConfigFn](#gear-junodevconfigfn)
- [JunoDevConfigFnOrObject](#gear-junodevconfigfnorobject)

#### :gear: ENCODING_TYPE

| Type            | Type                                                      |
| --------------- | --------------------------------------------------------- |
| `ENCODING_TYPE` | `'identity' or 'gzip' or 'compress' or 'deflate' or 'br'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/encoding.ts#L5)

#### :gear: JunoConfigMode

| Type             | Type                     |
| ---------------- | ------------------------ |
| `JunoConfigMode` | `'production' or string` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/mainnet/juno.env.ts#L5)

#### :gear: SatelliteDevDbCollection

| Type                       | Type                                                  |
| -------------------------- | ----------------------------------------------------- |
| `SatelliteDevDbCollection` | `Omit<Rule, 'createdAt' or 'updatedAt' or 'maxSize'>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/dev/juno.dev.config.ts#L7)

#### :gear: SatelliteDevStorageCollection

| Type                            | Type                                                      |
| ------------------------------- | --------------------------------------------------------- |
| `SatelliteDevStorageCollection` | `Omit<Rule, 'createdAt' or 'updatedAt' or 'maxCapacity'>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/dev/juno.dev.config.ts#L13)

#### :gear: JunoDevConfigFn

| Type              | Type                  |
| ----------------- | --------------------- |
| `JunoDevConfigFn` | `() => JunoDevConfig` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/dev/config.ts#L3)

#### :gear: JunoDevConfigFnOrObject

| Type                      | Type                               |
| ------------------------- | ---------------------------------- |
| `JunoDevConfigFnOrObject` | `JunoDevConfig or JunoDevConfigFn` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/dev/config.ts#L5)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
