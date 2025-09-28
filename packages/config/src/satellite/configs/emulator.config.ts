import * as z from 'zod';
import {refineEmulatorConfig} from '../validators/emulator.validators';

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
 * @see NetworkServices
 */
const NetworkServicesSchema = z.strictObject({
  registry: z.boolean().optional(),
  cmc: z.boolean().optional(),
  icp: z.boolean().optional(),
  cycles: z.boolean().optional(),
  nns: z.boolean().optional(),
  sns: z.boolean().optional(),
  internet_identity: z.boolean().optional(),
  nns_dapp: z.boolean().optional()
});

/**
 * Network services that can be enabled in the emulator.
 *
 * Each flag corresponds to a system canister or application that can be included
 * in the local Internet Computer network when the emulator starts.
 */
export interface NetworkServices {
  /**
   * Registry canister: Stores network configuration and topology (subnet membership, public keys, feature flags).
   * Acts as the source of truth other system canisters read/write to.
   */
  registry?: boolean;

  /**
   * CMC (Cycles Minting Canister): Converts ICP to cycles and distributes them; maintains subnet lists and conversion rate.
   * Requires icp and nns to not be enabled.
   */
  cmc?: boolean;

  /**
   * ICP token: Deploys the ICP ledger and index canisters.
   */
  icp?: boolean;

  /**
   * Cycles token: Deploys the cycles ledger and index canisters.
   */
  cycles?: boolean;

  /**
   * NNS governance canisters: Deploys the governance and root canisters.
   * Core governance system (neurons, proposals, voting) and related control logic.
   * Enables managing network-level decisions in an emulated environment.
   */
  nns?: boolean;

  /**
   * SNS canisters: Deploys the SNS-W and aggregator canisters.
   * Service Nervous System stack used to govern individual dapps.
   */
  sns?: boolean;

  /**
   * Internet Identity: Deploys the II canister for authentication.
   */
  internet_identity?: boolean;

  /**
   * NNS dapp: Deploys the NNS UI canister and frontend application
   * Requires cmc, icp, nns, sns, internet_identity to be enabled.
   */
  nns_dapp?: boolean;
}

/**
 * @see Network
 */
const NetworkSchema = z.strictObject({
  services: NetworkServicesSchema
});

/**
 * Configuration for customizing the Internet Computer network bootstrapped
 * by the emulator.
 */
export interface Network {
  /**
   * System canisters and applications available in the network.
   */
  services: NetworkServices;
}

/**
 * @see EmulatorConfig
 */
export const EmulatorConfigSchema = z
  .union([
    z.strictObject({
      runner: EmulatorRunnerSchema.optional(),
      network: NetworkSchema.optional(),
      skylab: EmulatorSkylabSchema
    }),
    z.strictObject({
      runner: EmulatorRunnerSchema.optional(),
      network: NetworkSchema.optional(),
      console: EmulatorConsoleSchema
    }),
    z.strictObject({
      runner: EmulatorRunnerSchema.optional(),
      network: NetworkSchema.optional(),
      satellite: EmulatorSatelliteSchema
    })
  ])
  .superRefine(refineEmulatorConfig);

/**
 * The configuration for running the Juno emulator.
 */
export type EmulatorConfig =
  | {runner?: EmulatorRunner; network?: Network; skylab: EmulatorSkylab}
  | {runner?: EmulatorRunner; network?: Network; console: EmulatorConsole}
  | {runner?: EmulatorRunner; network?: Network; satellite: EmulatorSatellite};
