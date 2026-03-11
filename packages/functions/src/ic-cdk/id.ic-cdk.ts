import {Principal} from '@icp-sdk/core/principal';

/**
 * Retrieves the Satellite's Principal ID.
 *
 * This function is a JavaScript binding for the Rust function
 * [`ic_cdk::api::canister_self()`](https://docs.rs/ic-cdk/latest/ic_cdk/api/fn.canister_self.html), which returns
 * the Principal of the executing canister.
 *
 * @returns {Principal} The Principal ID of the Satellite.
 */
export const canisterSelf = (): Principal => {
  const principal = Principal.fromUint8Array(__ic_cdk_id());

  // We assume the Principal is always built using the global function and is therefore always valid.
  // In other words, we do not validate it to conserve resources and optimize performance.

  return principal;
};

/**
 * @deprecated Use {@link canisterSelf} instead.
 */
export const id = (): Principal => canisterSelf();

/**
 * Retrieves the Satellite's Principal ID.
 *
 * @returns {Principal} The Principal ID of the Satellite.
 */
export const satelliteSelf = (): Principal => canisterSelf();
