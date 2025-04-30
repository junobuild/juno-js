/**
 * The options to configure the environment of the library.
 * @interface EnvironmentOptions
 */
export interface EnvironmentOptions {
  /**
   * Enable or disable tracking performances with Web Vitals.
   * @default true By default, the performance tracking is enabled.
   * @type {boolean}
   */
  performance?: boolean;
}

/**
 * Represents the actor environment configuration.
 * @typedef {Object} EnvironmentActor
 * @property {string} orbiterId - The ID of the orbiter.
 * @property {string} satelliteId - The ID of the satellite.
 * @property {boolean | string} [container] - Specifies whether the actor is running in a container or provides the container URL.
 */
export interface EnvironmentActor {
  orbiterId: string;
  satelliteId: string;
  container?: boolean | string;
}

/**
 * Represents the overall environment configuration.
 * @typedef {Object} Environment
 * @property {string} orbiterId - The ID of the orbiter.
 * @property {string} satelliteId - The ID of the satellite.
 * @property {boolean | string} [container] - Specifies whether the actor is running in a container or provides the container URL.
 * @property {EnvironmentOptions} [options] - The options of the analytics environment.
 */
export type Environment = EnvironmentActor & {
  options?: EnvironmentOptions;
};

/**
 * Represents the user environment configuration.
 * @typedef {Object} UserEnvironment
 * @property {boolean | string} [container] - Specifies whether the actor is running in a container or provides the container URL.
 * @property {string} [orbiterId] - The ID of the orbiter.
 * @property {string} [satelliteId] - The ID of the satellite.
 */
export type UserEnvironment = Omit<Environment, 'orbiterId' | 'satelliteId'> &
  Partial<Pick<EnvironmentActor, 'orbiterId' | 'satelliteId'>>;
