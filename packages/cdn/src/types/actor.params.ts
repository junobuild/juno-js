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
 * Represents the parameters for a Console actor.
 * @interface
 * @extends {ActorParameters}
 */
export interface ConsoleParameters extends ActorParameters {
  /**
   * The unique identifier for the Console.
   * @type {string}
   */
  consoleId: string | Principal;
}

/**
 * Represents the parameters for a Mission Control actor.
 * @interface
 * @extends {ActorParameters}
 */
export interface MissionControlParameters extends ActorParameters {
  /**
   * The unique identifier for the Mission Control.
   * @type {string}
   */
  missionControlId: string | Principal;
}

/**
 * Represents initialization parameters for either a Console or Mission Control actor.
 * Use discriminated unions to pass the correct parameters depending on the CDN to target.
 */
export type CdnParameters =
  | {console: ConsoleParameters}
  | {missionControl: MissionControlParameters};
