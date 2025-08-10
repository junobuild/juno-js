import type {HttpAgent, Identity} from '@dfinity/agent';
import type {Principal} from '@dfinity/principal';

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
   * Specifies whether the actor is calling the local development Docker container or provides the container URL.
   * @type {boolean | string}
   * @optional
   */
  container?: boolean | string;

  /**
   * An optional HttpAgent. If none is provided, a new agent will automatically be created to execute calls.
   */
  agent?: HttpAgent;
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
  satelliteId?: string | Principal;
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
  missionControlId?: string | Principal;
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
  consoleId?: string | Principal;
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
  orbiterId?: string | Principal;
}
