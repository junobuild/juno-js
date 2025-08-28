/**
 * Options that control the behavior of update call operations.
 *
 * Update calls on the Internet Computer are always certified.
 * This type enforces that `certified` is always `true` and exists
 * for consistency across all call-related configurations.
 *
 * @interface
 */
export interface UpdateOptions {
  /**
   * For update calls: always `true`.
   * Certification is enforced by the Internet Computer protocol.
   *
   * @type {true}
   */
  certified: true;
}

/**
 * Options that control the behavior of read call operations.
 *
 * These options apply to methods that perform read calls,
 * such as datastore queries or asset retrievals.
 */
export interface ReadOptions {
  /**
   * If true, performs read operations using certified calls.
   * Certified calls provide cryptographic proof that the data is verified by the Internet Computer.
   * This ensures data integrity but may increase latency compared to regular (non-certified) query calls.
   *
   * Defaults to false.
   *
   * @type {boolean}
   * @optional
   */
  certified?: boolean;
}

/**
 * Union type representing call options for both read and update operations.
 *
 * @typedef {UpdateOptions | ReadOptions} CallOptions
 */
export type CallOptions = UpdateOptions | ReadOptions;
