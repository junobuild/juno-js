import {IDL} from '@icp-sdk/core/candid';
import {Principal} from '@icp-sdk/core/principal';
import {IcrcLedgerIdl} from '../../../../canisters/declarations';
import {IcrcLedgerCanister} from '../../../../canisters/ledger/icrc';
import {
  type Account,
  type TransferArg,
  type TransferFromArg,
  type TransferFromResult,
  type TransferResult
} from '../../../../canisters/ledger/icrc/schemas';
import {mockCanisterId} from '../../../mocks/ic-cdk.mock';

describe('IcrcLedgerCanister', () => {
  const mockOwner = Principal.fromText('aaaaa-aa');
  const mockSpender = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
  const mockSubaccount = new Uint8Array(32).fill(1);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockIdlBalanceResult = (balance: bigint) =>
    new Uint8Array(IDL.encode([IcrcLedgerIdl.Tokens], [balance]));

  const mockIdlTransferResult = (result: TransferResult) =>
    new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [result]));

  const mockIdlTransferFromResult = (result: TransferFromResult) =>
    new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [result]));

  describe('constructor', () => {
    it('should create instance with provided canister ID', () => {
      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      expect(ledger.canisterId).toEqual(mockCanisterId);
    });

    it('should validate options schema', () => {
      expect(() => new IcrcLedgerCanister({canisterId: mockCanisterId})).not.toThrow();
    });

    it('should throw error for invalid options', () => {
      expect(() => new IcrcLedgerCanister({canisterId: 'invalid'} as any)).toThrow();
    });

    it('should throw error when canister ID is not provided', () => {
      expect(() => new IcrcLedgerCanister({} as any)).toThrow();
    });
  });

  describe('icrc1BalanceOf', () => {
    const mockAccount: Account = {
      owner: mockOwner,
      subaccount: undefined
    };

    it('should successfully return account balance', async () => {
      const expectedBalance = 1000000000n;

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlBalanceResult(expectedBalance))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1BalanceOf({account: mockAccount});

      expect(result).toBe(expectedBalance);
    });

    it('should handle zero balance', async () => {
      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlBalanceResult(0n))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1BalanceOf({account: mockAccount});

      expect(result).toBe(0n);
    });

    it('should handle account with subaccount', async () => {
      const accountWithSubaccount: Account = {
        owner: mockOwner,
        subaccount: mockSubaccount
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlBalanceResult(500000000n))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1BalanceOf({account: accountWithSubaccount});

      expect(result).toBe(500000000n);
    });

    it('should throw error if canister call fails', async () => {
      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          throw new Error('Network error');
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});

      await expect(ledger.icrc1BalanceOf({account: mockAccount})).rejects.toThrow('Network error');
    });
  });

  describe('icrc1Transfer', () => {
    const mockTransferArgs: TransferArg = {
      to: {owner: mockSpender, subaccount: undefined},
      fee: undefined,
      memo: undefined,
      from_subaccount: undefined,
      created_at_time: undefined,
      amount: 100000000n
    };

    it('should successfully transfer and return block index', async () => {
      const expectedBlockIndex = 12345n;
      const mockResponse: TransferResult = {Ok: expectedBlockIndex};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
      if ('Ok' in result) {
        expect(result.Ok).toBe(expectedBlockIndex);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle TransferError.GenericError', async () => {
      const mockResponse: TransferResult = {
        Err: {GenericError: {message: 'Something went wrong', error_code: 500n}}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
      expect(result).toHaveProperty('Err');
    });

    it('should handle TransferError.TemporarilyUnavailable', async () => {
      const mockResponse: TransferResult = {Err: {TemporarilyUnavailable: null}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferError.BadBurn', async () => {
      const mockResponse: TransferResult = {Err: {BadBurn: {min_burn_amount: 10000n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferError.Duplicate', async () => {
      const mockResponse: TransferResult = {Err: {Duplicate: {duplicate_of: 5000n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferError.BadFee', async () => {
      const mockResponse: TransferResult = {Err: {BadFee: {expected_fee: 10000n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferError.CreatedInFuture', async () => {
      const mockResponse: TransferResult = {
        Err: {CreatedInFuture: {ledger_time: 1700000000000000000n}}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferError.TooOld', async () => {
      const mockResponse: TransferResult = {Err: {TooOld: null}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferError.InsufficientFunds', async () => {
      const mockResponse: TransferResult = {Err: {InsufficientFunds: {balance: 50000000n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle transfer with all optional fields', async () => {
      const fullArgs: TransferArg = {
        to: {owner: mockSpender, subaccount: mockSubaccount},
        fee: 10000n,
        memo: new Uint8Array([1, 2, 3, 4]),
        from_subaccount: mockSubaccount,
        created_at_time: 1700000000000000000n,
        amount: 500000000n
      };

      const mockResponse: TransferResult = {Ok: 99999n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: fullArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should throw error if canister call fails', async () => {
      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          throw new Error('Network error');
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});

      await expect(ledger.icrc1Transfer({args: mockTransferArgs})).rejects.toThrow('Network error');
    });
  });

  describe('icrc2TransferFrom', () => {
    const mockTransferFromArgs: TransferFromArg = {
      from: {owner: mockOwner, subaccount: undefined},
      to: {owner: mockSpender, subaccount: undefined},
      fee: undefined,
      spender_subaccount: undefined,
      memo: undefined,
      created_at_time: undefined,
      amount: 100000000n
    };

    it('should successfully transfer from and return block index', async () => {
      const expectedBlockIndex = 54321n;
      const mockResponse: TransferFromResult = {Ok: expectedBlockIndex};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
      if ('Ok' in result) {
        expect(result.Ok).toBe(expectedBlockIndex);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle TransferFromError.GenericError', async () => {
      const mockResponse: TransferFromResult = {
        Err: {GenericError: {message: 'Generic error occurred', error_code: 1000n}}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferFromError.TemporarilyUnavailable', async () => {
      const mockResponse: TransferFromResult = {Err: {TemporarilyUnavailable: null}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferFromError.InsufficientAllowance', async () => {
      const mockResponse: TransferFromResult = {Err: {InsufficientAllowance: {allowance: 50000n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferFromError.BadBurn', async () => {
      const mockResponse: TransferFromResult = {Err: {BadBurn: {min_burn_amount: 10000n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferFromError.Duplicate', async () => {
      const mockResponse: TransferFromResult = {Err: {Duplicate: {duplicate_of: 8888n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferFromError.BadFee', async () => {
      const mockResponse: TransferFromResult = {Err: {BadFee: {expected_fee: 20000n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferFromError.CreatedInFuture', async () => {
      const mockResponse: TransferFromResult = {
        Err: {CreatedInFuture: {ledger_time: 1800000000000000000n}}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferFromError.TooOld', async () => {
      const mockResponse: TransferFromResult = {Err: {TooOld: null}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle TransferFromError.InsufficientFunds', async () => {
      const mockResponse: TransferFromResult = {Err: {InsufficientFunds: {balance: 30000000n}}};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should handle transfer from with all optional fields', async () => {
      const fullArgs: TransferFromArg = {
        from: {owner: mockOwner, subaccount: mockSubaccount},
        to: {owner: mockSpender, subaccount: mockSubaccount},
        fee: 15000n,
        spender_subaccount: mockSubaccount,
        memo: new Uint8Array([5, 6, 7, 8]),
        created_at_time: 1750000000000000000n,
        amount: 750000000n
      };

      const mockResponse: TransferFromResult = {Ok: 77777n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: fullArgs});

      expect(result).toEqual(mockResponse);
    });

    it('should throw error if canister call fails', async () => {
      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          throw new Error('Network error');
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});

      await expect(ledger.icrc2TransferFrom({args: mockTransferFromArgs})).rejects.toThrow(
        'Network error'
      );
    });

    it('should work with different ledger instances', async () => {
      const canisterId1 = Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai');
      const canisterId2 = Principal.fromText('qoctq-giaaa-aaaaa-aaaea-cai');
      const mockResponse: TransferFromResult = {Ok: 11111n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => mockIdlTransferFromResult(mockResponse))
      );

      const ledger1 = new IcrcLedgerCanister({canisterId: canisterId1});
      const ledger2 = new IcrcLedgerCanister({canisterId: canisterId2});

      const result1 = await ledger1.icrc2TransferFrom({args: mockTransferFromArgs});
      const result2 = await ledger2.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result1).toEqual(mockResponse);
      expect(result2).toEqual(mockResponse);
      expect(ledger1.canisterId).toEqual(canisterId1);
      expect(ledger2.canisterId).toEqual(canisterId2);
    });
  });
});
