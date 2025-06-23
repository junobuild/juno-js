import * as z from 'zod/v4';

const EmulatorPortsSchema = z.strictObject({
  /**
   * @default 5987
   */
  server: z.number().optional(),

  /**
   * @default 5999
   */
  admin: z.number().optional()
});

const ConsolePortSchema = z.strictObject({
  /**
   * Console UI (like https://console.juno.build) running with the emulator.
   * @default 5866
   */
  console: z.number()
});

/**
 * Represents the ports exposed by an emulator container.
 */
export interface EmulatorPorts {
  /**
   * The port of the server used to simulate execution. This is the port your app connects to.
   * Also known as the "local Internet Computer replica" or the "Pocket-IC port".
   * @default 5987
   */
  server?: number;

  /**
   * The port of the admin server used for tasks like transferring ICP from the ledger.
   * @default 5999
   */
  admin?: number;
}

/**
 * Accepts .mjs, .ts, .js, or .json
 */
const ConfigFileSchema = z.string().regex(/\.(mjs|ts|js|json)$/i, {
  message: 'Must be a .mjs, .ts, .js, or .json file'
});

/**
 * @see JunoConfigFile
 */
const JunoConfigFileSchema = ConfigFileSchema;

/**
 * Represents a Juno configuration file path.
 * Must end in `.mjs`, `.ts`, `.js`, or `.json`.
 */
export type JunoConfigFile = string;

/**
 * @see JunoDevConfigFile
 */
const JunoDevConfigFileSchema = ConfigFileSchema;

/**
 * Represents a Juno development config file path.
 * Must end in `.mjs`, `.ts`, `.js`, or `.json`.
 */
export type JunoDevConfigFile = string;

/**
 * @see EmulatorSkylab
 */
const EmulatorSkylabSchema = z.strictObject({
  ports: EmulatorPortsSchema.extend(ConsolePortSchema.shape).optional(),
  config: JunoConfigFileSchema
});

/**
 * Configuration for the Skylab emulator.
 */
export interface EmulatorSkylab {
  /**
   * Ports exposed by the Skylab container.
   */
  ports?: EmulatorPorts & {
    /**
     * Console UI (like https://console.juno.build) running with the emulator.
     * @default 5866
     */
    console: number;
  };

  /**
   * Path to the Juno config file.
   */
  config: JunoConfigFile;
}

/**
 * @see EmulatorConsole
 */
const EmulatorConsoleSchema = z.strictObject({
  ports: EmulatorPortsSchema.optional()
});

/**
 * Configuration for the Console emulator.
 */
export interface EmulatorConsole {
  /**
   * Ports exposed by the Console container.
   */
  ports?: EmulatorPorts;
}

/**
 * @see EmulatorSatellite
 */
const EmulatorSatelliteSchema = z.strictObject({
  ports: EmulatorPortsSchema.optional(),
  config: JunoDevConfigFileSchema
});

/**
 * Configuration for the Satellite emulator.
 */
export interface EmulatorSatellite {
  /**
   * Ports exposed by the Satellite container.
   */
  ports?: EmulatorPorts;

  /**
   * Path to the dev config file to customize Satellite behavior.
   */
  config: JunoDevConfigFile;
}

/**
 * @see EmulatorBaseConfig
 */
const EmulatorBaseConfigSchema = z.strictObject({
  runner: z.enum(['docker']),
  volume: z.string().optional(),
  target: z.string().optional()
});

/**
 * Shared options for all emulator variants.
 */
export interface EmulatorBaseConfig {
  /**
   * The containerization tool to run the emulator.
   */
  runner: 'docker';

  /**
   * Persistent volume to store internal state.
   * @default "juno"
   */
  volume?: string;

  /**
   * Shared folder for deploying and hot-reloading serverless functions.
   */
  target?: string;
}

/**
 * @see EmulatorConfig
 */
export const EmulatorConfigSchema = z.union([
  EmulatorBaseConfigSchema.extend({skylab: EmulatorSkylabSchema}).strict(),
  EmulatorBaseConfigSchema.extend({console: EmulatorConsoleSchema}).strict(),
  EmulatorBaseConfigSchema.extend({satellite: EmulatorSatelliteSchema}).strict()
]);

/**
 * The configuration for running the Juno emulator.
 */
export type EmulatorConfig =
  | (EmulatorBaseConfig & {skylab: EmulatorSkylab})
  | (EmulatorBaseConfig & {console: EmulatorConsole})
  | (EmulatorBaseConfig & {satellite: EmulatorSatellite});
