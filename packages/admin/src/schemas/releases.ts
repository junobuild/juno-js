import * as z from 'zod/v4';

/**
 * A schema for validating a version string in `x.y.z` format.
 *
 * Examples of valid versions:
 * - 0.1.0"
 * - 2.3.4
 */
const MetadataVersionSchema = z.string().refine((val) => /^\d+\.\d+\.\d+$/.test(val), {
  message: 'Version does not match x.y.z format'
});

/**
 * A version string in `x.y.z` format.
 */
export type MetadataVersion = z.infer<typeof MetadataVersionSchema>;

/**
 * A schema representing the metadata of a single release.
 *
 * Includes the version of the release itself (tag) and the versions
 * of all modules bundled with it.
 */
const ReleaseMetadataSchema = z.strictObject({
  /**
   * Unique version identifier for the release, following the `x.y.z` format.
   * @type {MetadataVersion}
   */
  tag: MetadataVersionSchema,

  /**
   * The version of the console included in the release.
   * @type {MetadataVersion}
   */
  console: MetadataVersionSchema,

  /**
   * Version of the Observatory module included in the release.
   * This field is optional because it was introduced in Juno v0.0.10.
   *
   * @type {MetadataVersion | undefined}
   */
  observatory: MetadataVersionSchema.optional(),

  /**
   * Version of the Mission Control module included in the release.
   * @type {MetadataVersion}
   */
  mission_control: MetadataVersionSchema,

  /**
   * Version of the Satellite module included in the release.
   * @type {MetadataVersion}
   */
  satellite: MetadataVersionSchema,

  /**
   * Version of the Orbiter module included in the release.
   * This field is optional because it was introduced in Juno v0.0.17.
   *
   * @type {MetadataVersion | undefined}
   */
  orbiter: MetadataVersionSchema.optional(),

  /**
   * Version of the Sputnik module included in the release.
   * This field is optional because it was introduced in Juno v0.0.47.
   *
   * @type {MetadataVersion | undefined}
   */
  sputnik: MetadataVersionSchema.optional()
});

/**
 * The metadata for a release provided by Juno.
 */
export type ReleaseMetadata = z.infer<typeof ReleaseMetadataSchema>;

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
  .array(ReleaseMetadataSchema)
  .refine((releases) => new Set(releases.map(({tag}) => tag)).size === releases.length, {
    message: 'A release tag appears multiple times but must be unique'
  });

/**
 * A schema representing the metadata for multiple releases provided by Juno.
 */
export const ReleasesMetadataSchema = z.strictObject({
  /**
   * List of all Mission Control versions across releases.
   * @type {MetadataVersion}
   */
  mission_controls: z.array(MetadataVersionSchema),

  /**
   * List of all Satellite versions across releases.
   * @type {MetadataVersion}
   */
  satellites: z.array(MetadataVersionSchema),

  /**
   * List of all Orbiter versions across releases.
   * @type {MetadataVersion}
   */
  orbiters: z.array(MetadataVersionSchema),

  /**
   * List of release metadata objects, each representing one release.
   */
  releases: ReleasesSchema
});

/**
 * The metadata for multiple releases provided by Juno.
 */
export type ReleasesMetadata = z.infer<typeof ReleasesMetadataSchema>;
