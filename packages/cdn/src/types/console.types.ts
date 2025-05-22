import type {Identity} from '@dfinity/agent';

/**
 * Represents the configuration for the console.
 * @interface
 */
export interface Console {
  /**
   * The identity associated with the console.
   * @type {Identity}
   */
  identity: Identity;

  /**
   * The unique identifier for the console.
   * @type {string}
   */
  consoleId?: string;

  /**
   * A custom fetch function to use for network requests.
   * @type {typeof fetch}
   */
  fetch?: typeof fetch;

  /**
   * Specifies whether the console is running in a container or provides the container URL. i.e. URL to Docker local development.
   * @type {boolean | string}
   */
  container?: boolean | string;
}

/**
 * Represents partial configuration options for a console. To be used only on NodeJS or rarely used for browser.
 * @typedef {Partial<Console>} ConsoleOptions
 */
export type ConsoleOptions = Partial<Console>;
