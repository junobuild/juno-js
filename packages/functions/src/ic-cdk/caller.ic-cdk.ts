import {Principal} from '@icp-sdk/core/principal';

/**
 * Retrieves the caller's Principal ID.
 *
 * This function is a JavaScript binding for the Rust function
 * [`ic_cdk::api::msg_caller()`](https://docs.rs/ic-cdk/latest/ic_cdk/api/fn.msg_caller.html), which returns
 * the Principal of the caller of the current call.
 *
 * @returns {Principal} The Principal ID of the caller.
 */
export const msgCaller = (): Principal => {
  const principal = Principal.fromUint8Array(__ic_cdk_caller());

  return principal;
};

/**
 * @deprecated Use {@link msgCaller} instead.
 */
export const caller = (): Principal => msgCaller();
