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

- [MaxMemorySizeConfigSchema](#gear-maxmemorysizeconfigschema)
- [StorageConfigSourceGlobSchema](#gear-storageconfigsourceglobschema)
- [StorageConfigHeaderSchema](#gear-storageconfigheaderschema)
- [StorageConfigRewriteSchema](#gear-storageconfigrewriteschema)
- [StorageConfigRedirectSchema](#gear-storageconfigredirectschema)
- [StorageConfigSchema](#gear-storageconfigschema)
- [JunoConfigModeSchema](#gear-junoconfigmodeschema)
- [JunoConfigEnvSchema](#gear-junoconfigenvschema)
- [EncodingTypeSchema](#gear-encodingtypeschema)
- [CliConfigSchema](#gear-cliconfigschema)

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

| Constant              | Type                                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StorageConfigSchema` | `ZodObject<{ headers: ZodOptional<ZodArray<ZodObject<{ source: ZodString; headers: ZodArray<ZodTuple<[ZodString, ZodString], null>>; }, $strict>>>; ... 5 more ...; version: ZodOptional<...>; }, $strip>` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L114)

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

### :tropical_drink: Interfaces

- [MaxMemorySizeConfig](#gear-maxmemorysizeconfig)
- [StorageConfigHeader](#gear-storageconfigheader)
- [StorageConfigRewrite](#gear-storageconfigrewrite)
- [StorageConfigRedirect](#gear-storageconfigredirect)
- [StorageConfig](#gear-storageconfig)
- [JunoConfigEnv](#gear-junoconfigenv)
- [CliConfig](#gear-cliconfig)

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
| `version`       | `bigint or undefined`                                 | The current version of the config. Optional. The CLI will automatically resolve the version and warn you if there's a potential overwrite. You can provide it if you want to manage versioning manually within your config file. type: {bigint}optional                                                                                                                                                                                                                                                                                                           |

#### :gear: JunoConfigEnv

Represents the environment configuration for Juno.

| Property | Type     | Description                                                |
| -------- | -------- | ---------------------------------------------------------- |
| `mode`   | `string` | The mode of the Juno configuration. type: {JunoConfigMode} |

#### :gear: CliConfig

| Property     | Type                                    | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`     | `string or undefined`                   | Specifies the directory from which to deploy to Storage. For instance, if `npm run build` outputs files to a `dist` folder, use `source: 'dist'`. default: 'build'type: {string}                                                                                                                                                                                                              |
| `ignore`     | `string[] or undefined`                 | Specifies files or patterns to ignore during deployment, using glob patterns similar to those in .gitignore. type: {string[]}optional                                                                                                                                                                                                                                                         |
| `gzip`       | `string or false or undefined`          | Controls the Gzip compression optimization for files in the source folder. By default, it targets JavaScript (js), ES Module (mjs), and CSS (css) files. You can disable this by setting it to `false` or customize it with a different file matching pattern using glob syntax. type: {string or false}optional                                                                              |
| `encoding`   | `[string, EncodingType][] or undefined` | Customizes file encoding mapping for HTTP response headers `Content-Encoding` based on file extension: - `.Z` for compress, - `.gz` for gzip, - `.br` for brotli, - `.zlib` for deflate, - anything else defaults to `identity`. The "encoding" attribute allows overriding default mappings with an array of glob patterns and encoding types. type: {Array<[string, EncodingType]>}optional |
| `predeploy`  | `string[] or undefined`                 | Defines a list of scripts or commands to be run before the deployment process begins. This can be useful for tasks such as compiling assets, running tests, or building production-ready files. Example: `json { "predeploy": ["npm run build", "npm run lint"] } ` type: {string[]}optional                                                                                                  |
| `postdeploy` | `string[] or undefined`                 | Defines a list of scripts or commands to be run after the deployment process completes. This can be used for tasks such as notifications, cleanup, or sending confirmation messages to services or team members. Example: `json { "postdeploy": ["./scripts/notify-admins.sh", "echo 'Deployment complete'"] } ` type: {string[]}optional                                                     |

### :cocktail: Types

- [StorageConfigSourceGlob](#gear-storageconfigsourceglob)
- [JunoConfigMode](#gear-junoconfigmode)
- [EncodingType](#gear-encodingtype)

#### :gear: StorageConfigSourceGlob

| Type                      | Type |
| ------------------------- | ---- |
| `StorageConfigSourceGlob` |      |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/shared/storage.config.ts#L13)

#### :gear: JunoConfigMode

| Type             | Type                     |
| ---------------- | ------------------------ |
| `JunoConfigMode` | `'production' or string` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/juno.env.ts#L12)

#### :gear: EncodingType

| Type           | Type                                                      |
| -------------- | --------------------------------------------------------- |
| `EncodingType` | `'identity' or 'gzip' or 'compress' or 'deflate' or 'br'` |

[:link: Source](https://github.com/junobuild/juno-js/tree/main/packages/config/src/types/encoding.ts#L12)

<!-- TSDOC_END -->

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
