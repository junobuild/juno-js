/**
 * Gets current timestamp, in nanoseconds since the epoch (1970-01-01)
 *
 * This function is a JavaScript binding for the Rust function
 * [`ic_cdk::time()`](https://docs.rs/ic-cdk/latest/ic_cdk/api/fn.time.html), which returns
 * the system time publicly exposed and verified part of the IC state tree
 *
 * @returns {bigint} The current timestamp.
 */
export const time = (): bigint => __ic_cdk_time();
