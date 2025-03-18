import {IDL} from '@dfinity/candid';
import {call} from '../../ic-cdk/call.ic-cdk';
import {CallParams} from '../../ic-cdk/schemas/call';
import {CallResponseLengthError} from '../../ic-cdk/types/errors';
import {mockCanisterId} from '../mocks/ic-cdk.mocks';

vi.stubGlobal(
  '__ic_cdk_call_raw',
  vi.fn(async () => {
    return new Uint8Array(IDL.encode([IDL.Text], ['Mock Response']));
  })
);

describe('ic-cdk > call', () => {
  describe('call function', () => {
    it('should successfully call a canister method and decode response', async () => {
      const params: CallParams = {
        canisterId: mockCanisterId,
        method: 'greet',
        args: [[IDL.Text, 'Hello']],
        results: [IDL.Text]
      };

      const result = await call<string>(params);
      expect(result).toBe('Mock Response');
    });

    it('should throw an error if more than one object is returned', async () => {
      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IDL.Text, IDL.Nat], ['Response1', 42]));
        })
      );

      const params: CallParams = {
        canisterId: mockCanisterId,
        method: 'multi_response',
        args: [[IDL.Text, 'Hello']],
        results: [IDL.Text, IDL.Nat]
      };

      await expect(call(params)).rejects.toBeInstanceOf(CallResponseLengthError);
    });

    it('should return undefined if response is empty', async () => {
      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => new Uint8Array(IDL.encode([], [])))
      );

      const params: CallParams = {
        canisterId: mockCanisterId,
        method: 'empty_call',
        args: [],
        results: []
      };

      const result = await call(params);
      expect(result).toBeUndefined();
    });

    it('should throw an error if parameters do not match the schema', async () => {
      const invalidParams = {
        canisterId: mockCanisterId,
        method: '',
        args: [[IDL.Text, 'Hello']],
        results: [IDL.Text]
      };

      await expect(call(invalidParams as any)).rejects.toThrow();
    });

    it('should throw an error if the canister call fails', async () => {
      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          throw new Error('Canister call failed');
        })
      );

      const params: CallParams = {
        canisterId: mockCanisterId,
        method: 'fail_call',
        args: [[IDL.Text, 'Hello']],
        results: [IDL.Text]
      };

      await expect(call(params)).rejects.toThrow('Canister call failed');
    });
  });
});
