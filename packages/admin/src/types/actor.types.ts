import type {Identity} from '@dfinity/agent';

/**
 * Represents the parameters for an actor.
 * @interface
 */
export interface ActorParameters {
  /**
   * The identity associated with the actor.
   * @type {Identity}
   */
  identity: Identity;

  /**
   * A custom fetch function to use for network requests. Useful in NodeJS context.
   * @type {typeof fetch}
   * @optional
   */
  fetch?: typeof fetch;

  /**
   * Specifies whether the actor is calling the local development Docker container or provides the container URL.
   * @type {boolean | string}
   * @optional
   */
  container?: boolean | string;
}

/**
 * Represents the parameters for a satellite actor.
 * @interface
 * @extends {ActorParameters}
 */
export interface SatelliteParameters extends ActorParameters {
  /**
   * The unique identifier for the satellite.
   * @type {string}
   * @optional
   */
  satelliteId?: string;
}

/**
 * Represents the parameters for a Mission Control actor.
 * @interface
 * @extends {ActorParameters}
 */
export interface MissionControlParameters extends ActorParameters {
  /**
   * The unique identifier for Mission Control.
   * @type {string}
   * @optional
   */
  missionControlId?: string;
}

/**
 * Represents the parameters for a Console actor.
 * @interface
 * @extends {ActorParameters}
 */
export interface ConsoleParameters extends ActorParameters {
  /**
   * The unique identifier for the console.
   * @type {string}
   * @optional
   */
  consoleId?: string;
}

/**
 * Represents the parameters for an Orbiter actor.
 * @interface
 * @extends {ActorParameters}
 */
export interface OrbiterParameters extends ActorParameters {
  /**
   * The unique identifier for the Orbiter.
   * @type {string}
   * @optional
   */
  orbiterId?: string;
}
