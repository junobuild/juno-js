/**
 * Represents metadata for a release.
 * @interface
 */
export interface ReleaseMetadata {
  /**
   * The tag of the release.
   * @type {string}
   */
  tag: string;

  /**
   * The version of the console included in the release.
   * @type {string}
   */
  console: string;

  /**
   * The version of the observatory included in the release.
   * @type {string}
   */
  observatory: string;

  /**
   * The version of the mission control included in the release.
   * @type {string}
   */
  mission_control: string;

  /**
   * The version of the satellite included in the release.
   * @type {string}
   */
  satellite: string;

  /**
   * The version of the orbiter included in the release.
   * @type {string}
   */
  orbiter: string;
}

/**
 * Represents metadata for multiple releases.
 * @interface
 */
export interface ReleasesMetadata {
  /**
   * The list of mission control versions.
   * @type {string[]}
   */
  mission_controls: string[];

  /**
   * The list of satellite versions.
   * @type {string[]}
   */
  satellites: string[];

  /**
   * The list of orbiter versions.
   * @type {string[]}
   */
  orbiters: string[];

  /**
   * The list of release metadata.
   * @type {ReleaseMetadata[]}
   */
  releases: ReleaseMetadata[];
}
