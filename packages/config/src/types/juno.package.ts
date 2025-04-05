/**
 * Represents the metadata of a Juno package.
 *
 * This metadata is embedded into a WASM file via `ic-wasm` under the `juno:package` custom section.
 * It describes what's coded in the WASM, whether it's a stock module, an extended template, or a developer's custom build.
 */
export interface JunoPackage {
  /**
   * The unique name of the package.
   *
   * Examples:
   * - "@junobuild/console" for the root module
   * - "@junobuild/satellite" for a stock module
   * - "my-project" for an extended or custom module
   */
  name: string;

  /**
   * The version of the package, using semantic versioning.
   *
   * This may refer to:
   * - The version of a stock package
   * - The version of an extended template
   * - A custom build version created by a developer
   *
   * Examples: "1.0.0", "0.1.0-beta.2"
   */
  version: string;

  /**
   * Optional dependencies this package builds upon.
   *
   * If defined, the presence of dependencies indicates that this package extends another one (e.g., Satellite or Sputnik).
   *
   * Example: { "@junobuild/sputnik": "0.1.0" }
   */
  dependencies?: JunoPackageDependencies;
}

/**
 * A mapping of dependency package names to their versions.
 *
 * Example:
 * ```ts
 * {
 *   "@junobuild/sputnik": "0.1.0"
 * }
 * ```
 */
export type JunoPackageDependencies = Record<string, string>;
