import {IDL} from '@icp-sdk/core/candid';
import {Principal} from '@icp-sdk/core/principal';
import {ICP_LEDGER_ID} from '../../../../canisters/_constants';
import {type IcpLedgerDid, IcpLedgerIdl} from '../../../../canisters/declarations';
import {IcpLedgerCanister} from '../../../../canisters/ledger/icp';
import {mockCanisterId} from '../../../mocks/ic-cdk.mock';

describe('IcpLedgerCanister', () => {
  const mockToAccountIdentifier = new Uint8Array(32).fill(1);
  const mockFromSubaccount = new Uint8Array(32).fill(2);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with default ICP Ledger canister ID', () => {
      const ledger = new IcpLedgerCanister();
      expect(ledger.canisterId).toEqual(ICP_LEDGER_ID);
    });

    it('should create instance with custom canister ID', () => {
      const ledger = new IcpLedgerCanister({canisterId: mockCanisterId});
      expect(ledger.canisterId).toEqual(mockCanisterId);
    });

    it('should validate options schema', () => {
      expect(() => new IcpLedgerCanister({})).not.toThrow();
      expect(() => new IcpLedgerCanister({canisterId: mockCanisterId})).not.toThrow();
    });

    it('should throw error for invalid options', () => {
      expect(() => new IcpLedgerCanister({canisterId: 'invalid'} as any)).toThrow();
    });
  });

  describe('transfer', () => {
    const mockTransferArgs: IcpLedgerDid.TransferArgs = {
      to: mockToAccountIdentifier,
      fee: {e8s: 10000n},
      memo: 0n,
      from_subaccount: [],
      created_at_time: [],
      amount: {e8s: 100000000n}
    };

    it('should successfully transfer and return block index', async () => {
      const expectedBlockIndex = 12345n;
      const mockResponse: IcpLedgerDid.TransferResult = {Ok: expectedBlockIndex};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
      expect(result).toHaveProperty('Ok');
      if ('Ok' in result) {
        expect(result.Ok).toBe(expectedBlockIndex);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle TransferError.TxTooOld response', async () => {
      const mockError: IcpLedgerDid.TransferResult = {
        Err: {
          TxTooOld: {
            allowed_window_nanos: 86400000000000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
      if ('Err' in result && 'TxTooOld' in result.Err) {
        expect(result.Err.TxTooOld.allowed_window_nanos).toBe(86400000000000n);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle TransferError.BadFee response', async () => {
      const mockError: IcpLedgerDid.TransferResult = {
        Err: {
          BadFee: {
            expected_fee: {e8s: 10000n}
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
      if ('Err' in result && 'BadFee' in result.Err) {
        expect(result.Err.BadFee.expected_fee.e8s).toBe(10000n);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle TransferError.TxDuplicate response', async () => {
      const duplicateOf = 5000n;
      const mockError: IcpLedgerDid.TransferResult = {
        Err: {
          TxDuplicate: {
            duplicate_of: duplicateOf
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
      if ('Err' in result && 'TxDuplicate' in result.Err) {
        expect(result.Err.TxDuplicate.duplicate_of).toBe(duplicateOf);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle TransferError.TxCreatedInFuture response', async () => {
      const mockError: IcpLedgerDid.TransferResult = {
        Err: {TxCreatedInFuture: null}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
    });

    it('should handle TransferError.InsufficientFunds response', async () => {
      const mockError: IcpLedgerDid.TransferResult = {
        Err: {
          InsufficientFunds: {
            balance: {e8s: 50000000n}
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
      if ('Err' in result && 'InsufficientFunds' in result.Err) {
        expect(result.Err.InsufficientFunds.balance.e8s).toBe(50000000n);
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

      const ledger = new IcpLedgerCanister();

      await expect(ledger.transfer({args: mockTransferArgs})).rejects.toThrow('Network error');
    });

    it('should handle transfer with from_subaccount', async () => {
      const argsWithSubaccount: IcpLedgerDid.TransferArgs = {
        ...mockTransferArgs,
        from_subaccount: [mockFromSubaccount]
      };

      const mockResponse: IcpLedgerDid.TransferResult = {Ok: 99999n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: argsWithSubaccount});

      expect(result).toEqual(mockResponse);
    });

    it('should handle transfer with created_at_time', async () => {
      const argsWithTime: IcpLedgerDid.TransferArgs = {
        ...mockTransferArgs,
        created_at_time: [{timestamp_nanos: 1234567890000000000n}]
      };

      const mockResponse: IcpLedgerDid.TransferResult = {Ok: 88888n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: argsWithTime});

      expect(result).toEqual(mockResponse);
    });

    it('should handle transfer with custom memo', async () => {
      const argsWithMemo: IcpLedgerDid.TransferArgs = {
        ...mockTransferArgs,
        memo: 123456789n
      };

      const mockResponse: IcpLedgerDid.TransferResult = {Ok: 77777n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: argsWithMemo});

      expect(result).toEqual(mockResponse);
    });

    it('should handle very large amount transfer', async () => {
      const largeAmountArgs: IcpLedgerDid.TransferArgs = {
        ...mockTransferArgs,
        amount: {e8s: 999999999999999999n}
      };

      const mockResponse: IcpLedgerDid.TransferResult = {Ok: 66666n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: largeAmountArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should pass correct arguments to call function', async () => {
      const mockCallRaw = vi.fn(async () => {
        return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [{Ok: 1000n}]));
      });

      vi.stubGlobal('__ic_cdk_call_raw', mockCallRaw);

      const ledger = new IcpLedgerCanister({canisterId: mockCanisterId});
      await ledger.transfer({args: mockTransferArgs});

      expect(mockCallRaw).toHaveBeenCalled();
    });

    it('should handle minimal transfer args', async () => {
      const minimalArgs: IcpLedgerDid.TransferArgs = {
        to: mockToAccountIdentifier,
        fee: {e8s: 10000n},
        memo: 0n,
        from_subaccount: [],
        created_at_time: [],
        amount: {e8s: 10000n}
      };

      const mockResponse: IcpLedgerDid.TransferResult = {Ok: 1n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: minimalArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should work with different canister IDs', async () => {
      const canisterId1 = Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai');
      const canisterId2 = Principal.fromText('qoctq-giaaa-aaaaa-aaaea-cai');
      const mockResponse: IcpLedgerDid.TransferResult = {Ok: 100n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger1 = new IcpLedgerCanister({canisterId: canisterId1});
      const ledger2 = new IcpLedgerCanister({canisterId: canisterId2});

      const result1 = await ledger1.transfer({args: mockTransferArgs});
      const result2 = await ledger2.transfer({args: mockTransferArgs});

      expect(result1).toEqual(mockResponse);
      expect(result2).toEqual(mockResponse);
      expect(ledger1.canisterId).toEqual(canisterId1);
      expect(ledger2.canisterId).toEqual(canisterId2);
    });

    it('should handle zero amount transfer', async () => {
      const zeroAmountArgs: IcpLedgerDid.TransferArgs = {
        ...mockTransferArgs,
        amount: {e8s: 0n}
      };

      const mockResponse: IcpLedgerDid.TransferResult = {Ok: 0n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: zeroAmountArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle all optional fields populated', async () => {
      const fullArgs: IcpLedgerDid.TransferArgs = {
        to: mockToAccountIdentifier,
        fee: {e8s: 10000n},
        memo: 999999n,
        from_subaccount: [mockFromSubaccount],
        created_at_time: [{timestamp_nanos: 1700000000000000000n}],
        amount: {e8s: 500000000n}
      };

      const mockResponse: IcpLedgerDid.TransferResult = {Ok: 55555n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcpLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcpLedgerCanister();
      const result = await ledger.transfer({args: fullArgs});

      expect(result).toEqual(mockResponse);
    });
  });
});
