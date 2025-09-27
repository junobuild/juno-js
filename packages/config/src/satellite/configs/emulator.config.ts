import * as z from 'zod';

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
  console: z.number().optional()
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
 * @see EmulatorSkylab
 */
const EmulatorSkylabSchema = z.strictObject({
  ports: EmulatorPortsSchema.extend(ConsolePortSchema.shape).optional()
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
  ports: EmulatorPortsSchema.optional()
});

/**
 * Configuration for the Satellite emulator.
 */
export interface EmulatorSatellite {
  /**
   * Ports exposed by the Satellite container.
   */
  ports?: EmulatorPorts;
}

/**
 * @see EmulatorRunner
 */
const EmulatorRunnerSchema = z.strictObject({
  type: z.enum(['docker', 'podman', 'container']),
  image: z.string().optional(),
  name: z.string().optional(),
  volume: z.string().optional(),
  target: z.string().optional(),
  platform: z.enum(['linux/amd64', 'linux/arm64']).optional()
});

/**
 * Shared options for all runner variants.
 */
export interface EmulatorRunner {
  /**
   * The containerization tool to run the emulator.
   */
  type: 'docker' | 'podman' | 'container';

  /**
   * Image reference.
   * @default depends on emulator type, e.g. "junobuild/skylab:latest"
   */
  image?: string;

  /**
   * Optional container name to use for the emulator.
   * Useful for reusing or managing a specific container.
   */
  name?: string;

  /**
   * Persistent volume to store internal state.
   * @default "juno"
   */
  volume?: string;

  /**
   * Shared folder for deploying and hot-reloading serverless functions.
   */
  target?: string;

  /**
   * The platform to use when running the emulator container.
   */
  platform?: 'linux/amd64' | 'linux/arm64';
}

/**
 * @see EmulatorConfig
 */
export const EmulatorConfigSchema = z.union([
  z.strictObject({
    runner: EmulatorRunnerSchema.optional(),
    skylab: EmulatorSkylabSchema
  }),
  z.strictObject({
    runner: EmulatorRunnerSchema.optional(),
    console: EmulatorConsoleSchema
  }),
  z.strictObject({
    runner: EmulatorRunnerSchema.optional(),
    satellite: EmulatorSatelliteSchema
  })
]);

/**
 * The configuration for running the Juno emulator.
 */
export type EmulatorConfig =
  | {runner?: EmulatorRunner; skylab: EmulatorSkylab}
  | {runner?: EmulatorRunner; console: EmulatorConsole}
  | {runner?: EmulatorRunner; satellite: EmulatorSatellite};
