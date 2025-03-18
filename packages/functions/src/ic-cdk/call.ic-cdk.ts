import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {CallParams, CallParamsSchema, IDLType} from './schemas/call';
import {CallResponseLengthError} from './types/errors';

/**
 * Makes an asynchronous call to a canister on the Internet Computer.
 *
 * This function encodes the provided arguments using Candid, performs the canister call,
 * and decodes the response based on the expected result types.
 *
 * @template T - The expected return type of the canister call.
 * @param {CallParams} params - The parameters required for the canister call
 * @returns {Promise<T | undefined>} A promise resolving to the decoded result of the call.
 *   Returns `undefined` if the canister response is empty.
 * @throws {ZodError} If the provided parameters do not match the expected schema.
 * @throws {Error} If the canister call fails.
 */
export const call = async <T>(params: CallParams): Promise<T> => {
  CallParamsSchema.parse(params);

  const {canisterId: providedCanisterId, method, args: providedArgs, results} = params;

  const canisterId =
    providedCanisterId instanceof Principal
      ? providedCanisterId.toUint8Array()
      : providedCanisterId;

  const [argsTypes, argsValues] = providedArgs.reduce<[IDLType[], unknown[]]>(
    ([argsTypes, argsValues], [type, value]) => [
      [...argsTypes, type],
      [...argsValues, value]
    ],
    [[], []]
  );

  const args = new Uint8Array(IDL.encode([...argsTypes], [...argsValues]));

  const bytes: Uint8Array<ArrayBuffer> = await __ic_cdk_call_raw(canisterId, method, args);

  const result = IDL.decode([...results], bytes.buffer);

  if (result.length > 1) {
    throw new CallResponseLengthError();
  }

  const [response] = result as unknown as [T];
  return response;
};
