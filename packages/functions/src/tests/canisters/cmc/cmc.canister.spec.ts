import {IDL} from '@icp-sdk/core/candid';
import {Principal} from '@icp-sdk/core/principal';
import {CMC_ID} from '../../../canisters/_constants';
import {CMCCanister} from '../../../canisters/cmc';
import {type CmcDid, CmcIdl} from '../../../canisters/declarations';
import {mockCanisterId} from '../../mocks/ic-cdk.mock';

describe('CMCCanister', () => {
  const mockBlockIndex = 12345n;
  const mockTargetCanisterId = Principal.fromText('qoctq-giaaa-aaaaa-aaaea-cai');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with default CMC canister ID', () => {
      const cmc = new CMCCanister();
      expect(cmc.canisterId).toEqual(CMC_ID);
    });

    it('should create instance with custom canister ID', () => {
      const cmc = new CMCCanister({canisterId: mockCanisterId});
      expect(cmc.canisterId).toEqual(mockCanisterId);
    });

    it('should validate options schema', () => {
      expect(() => new CMCCanister({})).not.toThrow();
      expect(() => new CMCCanister({canisterId: mockCanisterId})).not.toThrow();
    });

    it('should throw error for invalid options', () => {
      expect(() => new CMCCanister({canisterId: 'invalid'} as any)).toThrow();
    });
  });

  describe('notifyTopUp', () => {
    it('should successfully notify top up and return cycles', async () => {
      const expectedCycles = 1000000000000n;
      const mockResponse: CmcDid.NotifyTopUpResult = {Ok: expectedCycles};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([CmcIdl.NotifyTopUpResult], [mockResponse]));
        })
      );

      const cmc = new CMCCanister();
      const result = await cmc.notifyTopUp({
        blockIndex: mockBlockIndex,
        targetCanisterId: mockTargetCanisterId
      });

      expect(result).toEqual(mockResponse);

      expect(result).toHaveProperty('Ok');

      if ('Ok' in result) {
        expect(result.Ok).toBe(expectedCycles);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle NotifyError.Refunded response', async () => {
      const mockError: CmcDid.NotifyTopUpResult = {
        Err: {
          Refunded: {
            block_index: [mockBlockIndex],
            reason: 'Insufficient cycles'
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([CmcIdl.NotifyTopUpResult], [mockError]));
        })
      );

      const cmc = new CMCCanister();
      const result = await cmc.notifyTopUp({
        blockIndex: mockBlockIndex,
        targetCanisterId: mockTargetCanisterId
      });

      expect(result).toEqual(mockError);

      expect(result).toHaveProperty('Err');

      if ('Err' in result && 'Refunded' in result.Err) {
        expect(result.Err.Refunded.reason).toBe('Insufficient cycles');
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle NotifyError.InvalidTransaction response', async () => {
      const mockError: CmcDid.NotifyTopUpResult = {
        Err: {InvalidTransaction: 'Transaction format is invalid'}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([CmcIdl.NotifyTopUpResult], [mockError]));
        })
      );

      const cmc = new CMCCanister();
      const result = await cmc.notifyTopUp({
        blockIndex: mockBlockIndex,
        targetCanisterId: mockTargetCanisterId
      });

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
    });

    it('should handle NotifyError.Processing response', async () => {
      const mockError: CmcDid.NotifyTopUpResult = {
        Err: {Processing: null}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([CmcIdl.NotifyTopUpResult], [mockError]));
        })
      );

      const cmc = new CMCCanister();
      const result = await cmc.notifyTopUp({
        blockIndex: mockBlockIndex,
        targetCanisterId: mockTargetCanisterId
      });

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
    });

    it('should handle NotifyError.TransactionTooOld response', async () => {
      const oldestBlockIndex = 10000n;
      const mockError: CmcDid.NotifyTopUpResult = {
        Err: {TransactionTooOld: oldestBlockIndex}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([CmcIdl.NotifyTopUpResult], [mockError]));
        })
      );

      const cmc = new CMCCanister();
      const result = await cmc.notifyTopUp({
        blockIndex: mockBlockIndex,
        targetCanisterId: mockTargetCanisterId
      });

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
      if ('Err' in result && 'TransactionTooOld' in result.Err) {
        expect(result.Err.TransactionTooOld).toBe(oldestBlockIndex);
      }
    });

    it('should handle NotifyError.Other response', async () => {
      const mockError: CmcDid.NotifyTopUpResult = {
        Err: {
          Other: {
            error_message: 'Unknown error occurred',
            error_code: 500n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([CmcIdl.NotifyTopUpResult], [mockError]));
        })
      );

      const cmc = new CMCCanister();
      const result = await cmc.notifyTopUp({
        blockIndex: mockBlockIndex,
        targetCanisterId: mockTargetCanisterId
      });

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
      if ('Err' in result && 'Other' in result.Err) {
        expect(result.Err.Other.error_code).toBe(500n);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should throw error if canister call fails', async () => {
      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          throw new Error('Network error');
        })
      );

      const cmc = new CMCCanister();

      await expect(
        cmc.notifyTopUp({
          blockIndex: mockBlockIndex,
          targetCanisterId: mockTargetCanisterId
        })
      ).rejects.toThrow('Network error');
    });

    it('should pass correct arguments to call function', async () => {
      const mockCallRaw = vi.fn(async () => {
        return new Uint8Array(IDL.encode([CmcIdl.NotifyTopUpResult], [{Ok: 1000000n}]));
      });

      vi.stubGlobal('__ic_cdk_call_raw', mockCallRaw);

      const cmc = new CMCCanister({canisterId: mockCanisterId});
      await cmc.notifyTopUp({
        blockIndex: mockBlockIndex,
        targetCanisterId: mockTargetCanisterId
      });

      expect(mockCallRaw).toHaveBeenCalled();
    });

    it('should work with different canister IDs', async () => {
      const canisterId1 = Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai');
      const canisterId2 = Principal.fromText('qoctq-giaaa-aaaaa-aaaea-cai');
      const mockResponse: CmcDid.NotifyTopUpResult = {Ok: 2000000000n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([CmcIdl.NotifyTopUpResult], [mockResponse]));
        })
      );

      const cmc = new CMCCanister();

      const result1 = await cmc.notifyTopUp({
        blockIndex: mockBlockIndex,
        targetCanisterId: canisterId1
      });

      const result2 = await cmc.notifyTopUp({
        blockIndex: mockBlockIndex + 1n,
        targetCanisterId: canisterId2
      });

      expect(result1).toEqual(mockResponse);
      expect(result2).toEqual(mockResponse);
    });
  });
});
