/**
 * Specifies who can see the logs of the module.
 *
 * - 'controllers': Only the controllers of the module can see the logs.
 * - 'public': Everyone can see the logs.
 *
 * @typedef {'controllers' | 'public'} ModuleLogVisibility
 */
export type ModuleLogVisibility = 'controllers' | 'public';

/**
 * Settings for a module - Satellite, Mission Control or Orbiter.
 *
 * These settings control various aspects of the module's behavior and resource usage.
 *
 * @interface ModuleSettings
 */
export interface ModuleSettings {
  /**
   * The cycle threshold below which the module will automatically stop to avoid running out of cycles.
   *
   * For example, if set to `BigInt(1000000)`, the module will stop when it has fewer than 1,000,000 cycles remaining.
   *
   * @type {bigint}
   */
  freezingThreshold?: bigint;

  /**
   * The number of cycles reserved for the module's operations to ensure it has enough cycles to function.
   *
   * For example, setting it to `BigInt(5000000)` reserves 5,000,000 cycles for the module.
   *
   * @type {bigint}
   */
  reservedCyclesLimit?: bigint;

  /**
   * Controls who can see the module's logs.
   *
   * @type {ModuleLogVisibility}
   */
  logVisibility?: ModuleLogVisibility;

  /**
   * The maximum amount of WebAssembly (Wasm) memory the module can use on the heap.
   *
   * For example, setting it to `BigInt(1024 * 1024 * 64)` allows the module to use up to 64 MB of Wasm memory.
   *
   * @type {bigint}
   */
  wasmMemoryLimit?: bigint;

  /**
   * The amount of memory explicitly allocated to the module.
   *
   * For example, setting it to `BigInt(1024 * 1024 * 128)` allocates 128 MB of memory to the module.
   *
   * @type {bigint}
   */
  memoryAllocation?: bigint;

  /**
   * The proportion of compute capacity allocated to the module.
   *
   * This is a fraction of the total compute capacity of the subnet. For example, setting it to `BigInt(10)` allocates 10% of the compute capacity to the module.
   *
   * @type {bigint}
   */
  computeAllocation?: bigint;
}
