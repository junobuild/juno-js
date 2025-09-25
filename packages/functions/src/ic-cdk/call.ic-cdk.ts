import {IDL} from '@icp-sdk/core/candid';
import {Principal} from '@icp-sdk/core/principal';
import {toNullable} from '@dfinity/utils';
import {type CallParams, type IDLType, CallParamsSchema} from './schemas/call';
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

  const {canisterId: providedCanisterId, method, args: providedArgs, result: resultType} = params;

  const canisterId = Principal.from(providedCanisterId).toUint8Array();

  const [argsTypes, argsValues] = (providedArgs ?? []).reduce<[IDLType[], unknown[]]>(
    ([argsTypes, argsValues], [type, value]) => [
      [...argsTypes, type],
      [...argsValues, value]
    ],
    [[], []]
  );

  const args = new Uint8Array(IDL.encode([...argsTypes], [...argsValues]));

  const bytes: Uint8Array<ArrayBuffer> = await __ic_cdk_call_raw(canisterId, method, args);

  const result = IDL.decode(toNullable(resultType), bytes);

  // We have no test covering this use case because decode seems to never return more than one element, as we never specify more than one return type.
  if (result.length > 1) {
    throw new CallResponseLengthError();
  }

  const [response] = result as unknown as [T];
  return response;
};
