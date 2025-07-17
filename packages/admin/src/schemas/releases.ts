import * as z from 'zod/v4';

/**
 * A schema for validating a version string in `x.y.z` format.
 *
 * Examples of valid versions:
 * - 0.1.0"
 * - 2.3.4
 */
const VersionSchema = z.string().refine((val) => /^\d+\.\d+\.\d+$/.test(val), {
  message: 'Version does not match x.y.z format'
});

/**
 * A schema representing the metadata of a single release.
 *
 * Includes the version of the release itself (tag) and the versions
 * of all modules bundled with it.
 */
const ReleaseSchema = z.strictObject({
  /**
   * Unique version identifier for the release, following the `x.y.z` format.
   */
  tag: VersionSchema,

  /**
   * The version of the console included in the release.
   */
  console: VersionSchema,

  /**
   * Version of the Observatory module included in the release.
   */
  observatory: VersionSchema,

  /**
   * Version of the Mission Control module included in the release.
   */
  mission_control: VersionSchema,

  /**
   * Version of the Satellite module included in the release.
   */
  satellite: VersionSchema,

  /**
   * Version of the Orbiter module included in the release.
   */
  orbiter: VersionSchema
});

/**
 * A schema representing the list of releases provided by Juno.
 *
 * Rules:
 * - Each release must have a unique `tag` (version identifier).
 * - The same module version can appear in multiple releases, as not every release
 *   necessarily publishes a new version of each module.
 *
 * Validation:
 * - Ensures no duplicate `tag` values across the list of releases.
 */
const ReleasesSchema = z
  .array(ReleaseSchema)
  .refine((releases) => new Set(releases.map(({tag}) => tag)).size === releases.length, {
    message: 'A release tag appears multiple times but must be unique'
  });

/**
 * A schema representing the metadata for multiple releases provided by Juno.
 */
export const ReleasesMetadataSchema = z.strictObject({
  /**
   * List of all Mission Control versions across releases.
   */
  mission_controls: z.array(VersionSchema),

  /**
   * List of all Satellite versions across releases.
   */
  satellites: z.array(VersionSchema),

  /**
   * List of all Orbiter versions across releases.
   */
  orbiters: z.array(VersionSchema),

  /**
   * List of release metadata objects, each representing one release.
   */
  releases: ReleasesSchema
});

/**
 * Type representing the metadata for multiple releases provided by Juno.
 */
export type ReleasesMetadata = z.infer<typeof ReleasesMetadataSchema>;
