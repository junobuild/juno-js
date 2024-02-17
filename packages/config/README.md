[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/config
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/config
[npm-license]: https://img.shields.io/npm/l/@junobuild/config
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno Config

Configuration options for [Juno] CLI.

<!-- TSDOC_START -->

### :tropical_drink: Interfaces

- [JunoConfigEnv](#gear-junoconfigenv)
- [StorageConfigHeader](#gear-storageconfigheader)
- [StorageConfigRewrite](#gear-storageconfigrewrite)
- [StorageConfigRedirect](#gear-storageconfigredirect)
- [StorageConfig](#gear-storageconfig)
- [SatelliteAssertions](#gear-satelliteassertions)
- [SatelliteId](#gear-satelliteid)
- [SatelliteIds](#gear-satelliteids)
- [OrbiterConfig](#gear-orbiterconfig)
- [JunoConfig](#gear-junoconfig)

#### :gear: JunoConfigEnv

| Property | Type     | Description |
| -------- | -------- | ----------- |
| `mode`   | `string` |             |

#### :gear: StorageConfigHeader

Headers allow the client and the satellite to pass additional information along with a request or a response. Some sets of headers can affect how the browser handles the page and its content.

| Property  | Type                 | Description                                                                                                                                                                                  |
| --------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`  | `string`             | The glob pattern used to match files within the storage that these headers will apply to.                                                                                                    |
| `headers` | `[string, string][]` | An array of key-value pairs representing the headers to apply. Each pair includes the header name and its value.Example: `[["Cache-Control", "max-age=3600"], ["X-Custom-Header", "value"]]` |

#### :gear: StorageConfigRewrite

You can utilize optional rewrites to display the same content for multiple URLs. Rewrites are especially useful when combined with pattern matching, allowing acceptance of any URL that matches the pattern.

| Property      | Type     | Description                                                                                                           |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `source`      | `string` | The glob pattern or specific path to match for incoming requests. Matches are rewritten to the specified destination. |
| `destination` | `string` | The destination path or file to which matching requests should be rewritten.                                          |

#### :gear: StorageConfigRedirect

Use a URL redirect to prevent broken links if you've moved a page or to shorten URLs.

| Property   | Type         | Description                                                                                                   |
| ---------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| `source`   | `string`     | The glob pattern or specific path to match for incoming requests that should be redirected.                   |
| `location` | `string`     | The URL or path to which the request should be redirected.                                                    |
| `code`     | `301 or 302` | The HTTP status code to use for the redirect, typically 301 (permanent redirect) or 302 (temporary redirect). |

#### :gear: StorageConfig

Configures the Hosting behavior of the Storage.

| Property    | Type                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headers`   | `StorageConfigHeader[]`                  | Optional array of `StorageConfigHeader` objects to define custom HTTP headers for specific files or patterns.                                                                                                                                                                                                                                                                                               |
| `rewrites`  | `StorageConfigRewrite[]`                 | Optional array of `StorageConfigRewrite` objects to define rewrite rules.                                                                                                                                                                                                                                                                                                                                   |
| `redirects` | `StorageConfigRedirect[]`                | Optional array of `StorageConfigRedirect` objects to define HTTP redirects.                                                                                                                                                                                                                                                                                                                                 |
| `iframe`    | `"deny" or "same-origin" or "allow-any"` | For security reasons and to prevent click-jacking attacks, dapps deployed with Juno are, by default, set to deny embedding in other sites.Options are:- `deny`: Prevents any content from being displayed in an iframe.- `same-origin`: Allows iframe content from the same origin as the page.- `allow-any`: Allows iframe content from any origin.If not specified, then `deny` is used as default value. |

#### :gear: SatelliteAssertions

| Property     | Type                | Description                                                                                                                                                                                                                                                                                                                   |
| ------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heapMemory` | `number or boolean` | Configuration for the heap memory size check, which can be:- `true` to enable the check with a default threshold of 900MB,- `false` to disable the heap memory size check,- A `number` to specify a custom threshold in MB (megabytes) for the heap memory size check.If not specified, then `true` is used as default value. |

#### :gear: SatelliteId

| Property      | Type     | Description                                                       |
| ------------- | -------- | ----------------------------------------------------------------- |
| `satelliteId` | `string` | The unique identifier (ID) of the satellite for this application. |

#### :gear: SatelliteIds

| Property        | Type                     | Description                                                                                                                                                                                                                                                                                             |
| --------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `satellitesIds` | `Record<string, string>` | A mapping of satellite identifiers (IDs) to different configurations based on the mode of the application.This allows the application to use different satellite IDs, such as production, staging, etc.Example:{ "production": "xo2hm-lqaaa-aaaal-ab3oa-cai", "staging": "gl6nx-5maaa-aaaaa-qaaqq-cai"} |

#### :gear: OrbiterConfig

| Property    | Type     | Description                                     |
| ----------- | -------- | ----------------------------------------------- |
| `orbiterId` | `string` | The identifier of the orbiter used in the dApp. |

#### :gear: JunoConfig

| Property    | Type              | Description |
| ----------- | ----------------- | ----------- |
| `satellite` | `SatelliteConfig` |             |
| `orbiter`   | `OrbiterConfig`   |             |

### :cocktail: Types

- [ENCODING_TYPE](#gear-encoding_type)
- [JunoConfigMode](#gear-junoconfigmode)
- [StorageConfigSourceGlob](#gear-storageconfigsourceglob)
- [Only](#gear-only)
- [Either](#gear-either)
- [SatelliteConfig](#gear-satelliteconfig)

#### :gear: ENCODING_TYPE

| Type            | Type                                                      |
| --------------- | --------------------------------------------------------- |
| `ENCODING_TYPE` | `'identity' or 'gzip' or 'compress' or 'deflate' or 'br'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/encoding.ts#L1)

#### :gear: JunoConfigMode

| Type             | Type                                      |
| ---------------- | ----------------------------------------- |
| `JunoConfigMode` | `'production' or 'development' or string` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L1)

#### :gear: StorageConfigSourceGlob

Represents a glob pattern for matching files in the storage configuration.

| Type                      | Type |
| ------------------------- | ---- |
| `StorageConfigSourceGlob` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/storage.config.ts#L4)

#### :gear: Only

| Type   | Type |
| ------ | ---- |
| `Only` | `{   |

[P in keyof T]: T[P];
} and {
[P in keyof U]?: never;
}` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/utility.ts#L2)

#### :gear: Either

| Type     | Type                       |
| -------- | -------------------------- |
| `Either` | `Only<T, U> or Only<U, T>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/utility.ts#L8)

#### :gear: SatelliteConfig

| Type              | Type                                     |
| ----------------- | ---------------------------------------- |
| `SatelliteConfig` | `Either<SatelliteId, SatelliteIds> and { |

/\*\*

- Specifies the directory from which to deploy to storage.
- For instance, if `npm run build` outputs files to a `dist` folder, use `source: 'dist'`.
-
- @default `build`
  \*/
  source?: string;

/\*\*

- Optional configuration parameters for the satellite, affecting the operational behavior of its Storage.
- Changes to these parameters must be applied manually afterwards using `juno config` commands.
  \*/
  storage?: StorageConfig;

/\*\*

- Specifies files or patterns to ignore during deployment, using glob patterns similar to those in .gitignore.
  \*/
  ignore?: string[];

/\*\*

- Controls the Gzip compression optimization for files in the source folder. By default, it targets JavaScript (js), ES Module (mjs), and CSS (css) files.
- You can disable this by setting it to `false` or customize it with a different file matching pattern using glob syntax.
  \*/
  gzip?: string or false;

/\*\*

- Customizes file encoding mapping for HTTP response headers `Content-Encoding` based on file extension:
- - `.Z` for compress,
- - `.gz` for gzip,
- - `.br` for brotli,
- - `.zlib` for deflate,
- - anything else defaults to `identity`.
- The "encoding" attribute allows overriding default mappings with an array of glob patterns and encoding types.
  \*/
  encoding?: Array<[string, ENCODING_TYPE]>;

/\*\*

- Optional configurations to override default assertions made by the CLI regarding satellite deployment conditions.
  \*/
  assertions?: SatelliteAssertions;
  }` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.config.ts#L40)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
