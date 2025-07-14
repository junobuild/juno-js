import type {SatelliteContext} from './satellite';

/**
 * Represents the path to a web worker.
 * @typedef {string} EnvironmentWorkerPath
 */
export type EnvironmentWorkerPath = string;

/**
 * Represents a web worker which can be a enable for default path or provided with a specific path string.
 * @typedef {true | EnvironmentWorkerPath} EnvironmentWorker
 */
export type EnvironmentWorker = true | EnvironmentWorkerPath;

/**
 * Represents the environment workers.
 * @interface
 */
export interface EnvironmentWorkers {
  /**
   * The authentication worker configuration. A worker which takes cares of validating the session and if expired, triggers an event to ultimately logout the user automatically.
   * @type {EnvironmentWorker}
   */
  auth?: EnvironmentWorker;
}

/**
 * The environment configuration.
 * @typedef {Object} Environment
 * @property {string} [internetIdentityId] - The optional Internet Identity ID. Generally not provided.
 * @property {EnvironmentWorkers} [workers] - The optional web workers configuration.
 * @property {string} satelliteId - The satellite ID (required).
 * @property {string} [container] - The container. Commonly true to use local development with Docker.
 */
export type Environment = {
  internetIdentityId?: string;
  workers?: EnvironmentWorkers;
} & Required<Pick<SatelliteContext, 'satelliteId'>> &
  Pick<SatelliteContext, 'container'>;

/**
 * Represents the user environment configuration. i.e. the optional parameters the user is providing to initialize Juno.
 * @typedef {Object} UserEnvironment
 * @property {string} [internetIdentityId] - The optional Internet Identity ID. Generally not provided.
 * @property {EnvironmentWorkers} [workers] - The environment workers configuration.
 * @property {string} satelliteId - An optional satellite ID. If not provided, the library tries to load the information injected by the Vite and NextJS plugins.
 * @property {string} [container] - The container. If not provided, the library tries to load the information injected by the Vite and NextJS plugins.
 */
export type UserEnvironment = Omit<Environment, 'satelliteId'> &
  Pick<SatelliteContext, 'satelliteId'>;
