import * as z from 'zod';

/**
 * @see ApiConfig
 */
export const ApiConfigSchema = z.strictObject({
  url: z.url()
});

/**
 * Configuration for the Juno API endpoints. Useful for local development or self-hosting.
 * @interface ApiConfig
 */
export interface ApiConfig {
  /**
   * The base URL for the Juno API.
   * @default https://api.juno.build
   * @type {string}
   */
  url: string;
}
