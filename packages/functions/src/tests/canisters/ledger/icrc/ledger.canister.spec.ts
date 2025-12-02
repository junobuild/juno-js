import {IDL} from '@icp-sdk/core/candid';
import {Principal} from '@icp-sdk/core/principal';
import {type IcrcLedgerDid, IcrcLedgerIdl} from '../../../../canisters/declarations';
import {IcrcLedgerCanister} from '../../../../canisters/ledger/icrc';
import {mockCanisterId} from '../../../mocks/ic-cdk.mock';

describe('IcrcLedgerCanister', () => {
  const mockOwner = Principal.fromText('aaaaa-aa');
  const mockSpender = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
  const mockSubaccount = new Uint8Array(32).fill(1);

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    const mockAccount: IcrcLedgerDid.Account = {
      owner: mockOwner,
      subaccount: []
    };

    it('should successfully return account balance', async () => {
      const expectedBalance = 1000000000n;

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.Tokens], [expectedBalance]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1BalanceOf({account: mockAccount});

      expect(result).toBe(expectedBalance);
    });

    it('should handle zero balance', async () => {
      const zeroBalance = 0n;

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.Tokens], [zeroBalance]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1BalanceOf({account: mockAccount});

      expect(result).toBe(zeroBalance);
    });

    it('should handle account with subaccount', async () => {
      const accountWithSubaccount: IcrcLedgerDid.Account = {
        owner: mockOwner,
        subaccount: [mockSubaccount]
      };
      const expectedBalance = 500000000n;

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.Tokens], [expectedBalance]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1BalanceOf({account: accountWithSubaccount});

      expect(result).toBe(expectedBalance);
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
    const mockTransferArgs: IcrcLedgerDid.TransferArg = {
      to: {owner: mockSpender, subaccount: []},
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: 100000000n
    };

    it('should successfully transfer and return block index', async () => {
      const expectedBlockIndex = 12345n;
      const mockResponse: IcrcLedgerDid.TransferResult = {Ok: expectedBlockIndex};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockResponse]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockResponse);
      expect(result).toHaveProperty('Ok');
      if ('Ok' in result) {
        expect(result.Ok).toBe(expectedBlockIndex);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle TransferError.GenericError', async () => {
      const mockError: IcrcLedgerDid.TransferResult = {
        Err: {
          GenericError: {
            message: 'Something went wrong',
            error_code: 500n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
      expect(result).toHaveProperty('Err');
    });

    it('should handle TransferError.TemporarilyUnavailable', async () => {
      const mockError: IcrcLedgerDid.TransferResult = {
        Err: {TemporarilyUnavailable: null}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferError.BadBurn', async () => {
      const mockError: IcrcLedgerDid.TransferResult = {
        Err: {
          BadBurn: {
            min_burn_amount: 10000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferError.Duplicate', async () => {
      const mockError: IcrcLedgerDid.TransferResult = {
        Err: {
          Duplicate: {
            duplicate_of: 5000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferError.BadFee', async () => {
      const mockError: IcrcLedgerDid.TransferResult = {
        Err: {
          BadFee: {
            expected_fee: 10000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferError.CreatedInFuture', async () => {
      const mockError: IcrcLedgerDid.TransferResult = {
        Err: {
          CreatedInFuture: {
            ledger_time: 1700000000000000000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferError.TooOld', async () => {
      const mockError: IcrcLedgerDid.TransferResult = {
        Err: {TooOld: null}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferError.InsufficientFunds', async () => {
      const mockError: IcrcLedgerDid.TransferResult = {
        Err: {
          InsufficientFunds: {
            balance: 50000000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc1Transfer({args: mockTransferArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle transfer with all optional fields', async () => {
      const fullArgs: IcrcLedgerDid.TransferArg = {
        to: {owner: mockSpender, subaccount: [mockSubaccount]},
        fee: [10000n],
        memo: [new Uint8Array([1, 2, 3, 4])],
        from_subaccount: [mockSubaccount],
        created_at_time: [1700000000000000000n],
        amount: 500000000n
      };

      const mockResponse: IcrcLedgerDid.TransferResult = {Ok: 99999n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferResult], [mockResponse]));
        })
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
    const mockTransferFromArgs: IcrcLedgerDid.TransferFromArgs = {
      from: {owner: mockOwner, subaccount: []},
      to: {owner: mockSpender, subaccount: []},
      fee: [],
      spender_subaccount: [],
      memo: [],
      created_at_time: [],
      amount: 100000000n
    };

    it('should successfully transfer from and return block index', async () => {
      const expectedBlockIndex = 54321n;
      const mockResponse: IcrcLedgerDid.TransferFromResult = {Ok: expectedBlockIndex};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockResponse]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockResponse);
      expect(result).toHaveProperty('Ok');
      if ('Ok' in result) {
        expect(result.Ok).toBe(expectedBlockIndex);
        return;
      }

      expect(true).toBeFalsy();
    });

    it('should handle TransferFromError.GenericError', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {
          GenericError: {
            message: 'Generic error occurred',
            error_code: 1000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferFromError.TemporarilyUnavailable', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {TemporarilyUnavailable: null}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferFromError.InsufficientAllowance', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {
          InsufficientAllowance: {
            allowance: 50000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferFromError.BadBurn', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {
          BadBurn: {
            min_burn_amount: 10000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferFromError.Duplicate', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {
          Duplicate: {
            duplicate_of: 8888n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferFromError.BadFee', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {
          BadFee: {
            expected_fee: 20000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferFromError.CreatedInFuture', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {
          CreatedInFuture: {
            ledger_time: 1800000000000000000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferFromError.TooOld', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {TooOld: null}
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle TransferFromError.InsufficientFunds', async () => {
      const mockError: IcrcLedgerDid.TransferFromResult = {
        Err: {
          InsufficientFunds: {
            balance: 30000000n
          }
        }
      };

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockError]));
        })
      );

      const ledger = new IcrcLedgerCanister({canisterId: mockCanisterId});
      const result = await ledger.icrc2TransferFrom({args: mockTransferFromArgs});

      expect(result).toEqual(mockError);
    });

    it('should handle transfer from with all optional fields', async () => {
      const fullArgs: IcrcLedgerDid.TransferFromArgs = {
        from: {owner: mockOwner, subaccount: [mockSubaccount]},
        to: {owner: mockSpender, subaccount: [mockSubaccount]},
        fee: [15000n],
        spender_subaccount: [mockSubaccount],
        memo: [new Uint8Array([5, 6, 7, 8])],
        created_at_time: [1750000000000000000n],
        amount: 750000000n
      };

      const mockResponse: IcrcLedgerDid.TransferFromResult = {Ok: 77777n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockResponse]));
        })
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
      const mockResponse: IcrcLedgerDid.TransferFromResult = {Ok: 11111n};

      vi.stubGlobal(
        '__ic_cdk_call_raw',
        vi.fn(async () => {
          return new Uint8Array(IDL.encode([IcrcLedgerIdl.TransferFromResult], [mockResponse]));
        })
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
