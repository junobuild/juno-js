import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {CallParams, CallParamsSchema} from './schemas/call';

export const call = async (params: CallParams) => {
  CallParamsSchema.parse(params);

  const {
    canisterId: providedCanisterId,
    method,
    args: {value: argsValue, type: argsType}
  } = params;

  const canisterId =
    providedCanisterId instanceof Principal
      ? providedCanisterId.toUint8Array()
      : providedCanisterId;

  const args = new Uint8Array(IDL.encode([argsType], [argsValue]));

  const result = await __ic_cdk_call_raw(canisterId, method, args);

  // TODO: decode and respond
};
