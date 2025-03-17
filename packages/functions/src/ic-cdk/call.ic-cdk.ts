import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {CallParams, CallParamsSchema} from './schemas/call';

export const call = async <T>(params: CallParams): Promise<T | undefined> => {
  CallParamsSchema.parse(params);

  const {
    canisterId: providedCanisterId,
    method,
    args: {values: argsValues, types: argsTypes},
    results: {types: resultsTypes}
  } = params;

  const canisterId =
    providedCanisterId instanceof Principal
      ? providedCanisterId.toUint8Array()
      : providedCanisterId;

  const args = new Uint8Array(IDL.encode([...argsTypes], [...argsValues]));

  const bytes: Uint8Array<ArrayBuffer> = await __ic_cdk_call_raw(canisterId, method, args);

  const result = IDL.decode([...resultsTypes], bytes.buffer);

  if (result.length === 0) {
    return undefined;
  }

  return result as unknown as T;
};
