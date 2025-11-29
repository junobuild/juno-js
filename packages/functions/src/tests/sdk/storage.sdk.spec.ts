import {Principal} from '@icp-sdk/core/principal';
import {ZodError} from 'zod';
import {
  CountAssetsStoreParams,
  CountCollectionAssetsStoreParams,
  DeleteAssetsStoreParams,
  DeleteAssetStoreParams,
  DeleteFilteredAssetsStoreParams,
  GetAssetStoreParams,
  GetContentChunksStoreParams,
  ListAssetsStoreParams,
  SetAssetHandlerParams,
  SetAssetTokenStoreParams
} from '../../sdk/schemas/storage';
import {
  countAssetsStore,
  countCollectionAssetsStore,
  deleteAssetsStore,
  deleteAssetStore,
  deleteFilteredAssetsStore,
  getAssetStore,
  getContentChunksStore,
  listAssetsStore,
  setAssetHandler,
  setAssetTokenStore
} from '../../sdk/storage.sdk';

const mockCount = 669n;

vi.stubGlobal(
  '__juno_satellite_storage_count_collection_assets_store',
  vi.fn(() => mockCount)
);
vi.stubGlobal(
  '__juno_satellite_storage_count_assets_store',
  vi.fn(() => mockCount)
);

const mockSetHandler = vi.fn();

vi.stubGlobal('__juno_satellite_storage_set_asset_handler', mockSetHandler);

const collection = 'images';
const full_path = '/images/logo.png';

const mockDeletedAsset = {
  key: {
    name: 'logo.png',
    full_path,
    collection,
    owner: new Uint8Array([0, 1, 2])
  },
  headers: [],
  encodings: {},
  created_at: 1n,
  updated_at: 2n
};

const mockDeletedAssets = [mockDeletedAsset];

const mockDeleteAssetHandler = vi.fn(() => mockDeletedAsset);
const mockDeleteAssetsHandler = vi.fn();
const mockDeleteFilteredAssetsHandler = vi.fn(() => mockDeletedAssets);

vi.stubGlobal('__juno_satellite_storage_delete_asset_store', mockDeleteAssetHandler);
vi.stubGlobal('__juno_satellite_storage_delete_assets_store', mockDeleteAssetsHandler);
vi.stubGlobal(
  '__juno_satellite_storage_delete_filtered_assets_store',
  mockDeleteFilteredAssetsHandler
);

const mockSetAssetTokenHandler = vi.fn();

vi.stubGlobal('__juno_satellite_storage_set_asset_token_store', mockSetAssetTokenHandler);

const mockAsset = {
  key: {
    name: 'logo.png',
    full_path,
    collection,
    owner: new Uint8Array([0, 1, 2])
  },
  headers: [],
  encodings: {},
  created_at: 1n,
  updated_at: 2n
};

const mockListAssets = {
  items: [
    [
      'logo.png',
      {
        owner: new Uint8Array([0, 1, 2]),
        data: new Uint8Array([1, 2, 3]),
        created_at: 1n,
        updated_at: 2n,
        description: 'logo',
        version: 1n
      }
    ]
  ],
  items_length: 1n,
  matches_length: 1n,
  items_page: 1n,
  matches_pages: 1n
};

vi.stubGlobal(
  '__juno_satellite_storage_get_asset_store',
  vi.fn(() => mockAsset)
);
vi.stubGlobal(
  '__juno_satellite_storage_list_assets_store',
  vi.fn(() => mockListAssets)
);

const mockChunk = new Uint8Array([1, 2, 3, 4]);

vi.stubGlobal(
  '__juno_satellite_storage_get_content_chunks_store',
  vi.fn(() => mockChunk)
);

describe('storage.sdk', () => {
  const collection = 'images';

  describe('countCollectionAssetsStore', () => {
    const validParams: CountCollectionAssetsStoreParams = {
      collection
    };

    it('should call __juno_satellite_storage_count_collection_assets_store with correct params', () => {
      const result = countCollectionAssetsStore(validParams);

      expect(global.__juno_satellite_storage_count_collection_assets_store).toHaveBeenCalledWith(
        validParams.collection
      );
      expect(result).toBe(mockCount);
    });

    it('should throw ZodError if params are invalid', () => {
      const invalid = {
        collection: 123
      } as unknown as CountCollectionAssetsStoreParams;

      expect(() => countCollectionAssetsStore(invalid)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      vi.mocked(global.__juno_satellite_storage_count_collection_assets_store).mockImplementation(
        () => {
          throw new Error('Satellite count failure');
        }
      );

      expect(() => countCollectionAssetsStore(validParams)).toThrow('Satellite count failure');
    });
  });

  describe('countAssetsStore', () => {
    const baseParamsWithUint8Array: CountAssetsStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      params: {}
    };

    const baseParamsWithPrincipal: CountAssetsStoreParams = {
      caller: Principal.anonymous(),
      collection,
      params: {}
    };

    it('should call __juno_satellite_storage_count_assets_store with correct params (Uint8Array)', () => {
      const result = countAssetsStore(baseParamsWithUint8Array);

      expect(global.__juno_satellite_storage_count_assets_store).toHaveBeenCalledWith(
        baseParamsWithUint8Array.caller,
        collection,
        {}
      );
      expect(result).toBe(mockCount);
    });

    it('should call __juno_satellite_storage_count_assets_store with caller converted to Uint8Array (Principal)', () => {
      const result = countAssetsStore(baseParamsWithPrincipal);

      expect(global.__juno_satellite_storage_count_assets_store).toHaveBeenCalledWith(
        (baseParamsWithPrincipal.caller as Principal).toUint8Array(),
        collection,
        {}
      );
      expect(result).toBe(mockCount);
    });

    it('should throw ZodError if input is invalid', () => {
      const invalidParams = {
        caller: 42,
        collection,
        params: {}
      } as unknown as CountAssetsStoreParams;

      expect(() => countAssetsStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      vi.mocked(global.__juno_satellite_storage_count_assets_store).mockImplementation(() => {
        throw new Error('Satellite filtered count error');
      });

      expect(() => countAssetsStore(baseParamsWithUint8Array)).toThrow(
        'Satellite filtered count error'
      );
    });
  });

  describe('setAssetHandler', () => {
    const baseParams: SetAssetHandlerParams = {
      key: {
        name: 'logo.png',
        full_path: '/images/logo.png',
        collection,
        owner: new Uint8Array([0, 1, 2])
      },
      content: new Uint8Array([4, 5, 6]),
      headers: [['Content-Type', 'image/png']]
    };

    it('should call __juno_satellite_storage_set_asset_handler with correct params', () => {
      setAssetHandler(baseParams);

      expect(global.__juno_satellite_storage_set_asset_handler).toHaveBeenCalledWith(
        baseParams.key,
        baseParams.content,
        baseParams.headers
      );
    });

    it('should throw ZodError if params are invalid', () => {
      const invalid = {
        key: {},
        content: 'not-bytes',
        headers: 'invalid'
      } as unknown as SetAssetHandlerParams;

      expect(() => setAssetHandler(invalid)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      mockSetHandler.mockImplementation(() => {
        throw new Error('set failed');
      });

      expect(() => setAssetHandler(baseParams)).toThrow('set failed');
    });
  });

  describe('deleteAssetStore', () => {
    const paramsWithUint8Array: DeleteAssetStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      full_path
    };

    const paramsWithPrincipal: DeleteAssetStoreParams = {
      caller: Principal.anonymous(),
      collection,
      full_path
    };

    it('should call __juno_satellite_storage_delete_asset_store with Uint8Array caller', () => {
      const result = deleteAssetStore(paramsWithUint8Array);
      expect(mockDeleteAssetHandler).toHaveBeenCalledWith(
        paramsWithUint8Array.caller,
        collection,
        full_path
      );
      expect(result).toBe(mockDeletedAsset);
    });

    it('should call __juno_satellite_storage_delete_asset_store with Principal caller converted to Uint8Array', () => {
      const result = deleteAssetStore(paramsWithPrincipal);
      expect(mockDeleteAssetHandler).toHaveBeenCalledWith(
        (paramsWithPrincipal.caller as Principal).toUint8Array(),
        collection,
        full_path
      );
      expect(result).toBe(mockDeletedAsset);
    });

    it('should throw ZodError if params are invalid', () => {
      const invalidParams = {
        caller: 123,
        collection,
        full_path
      } as unknown as DeleteAssetStoreParams;

      expect(() => deleteAssetStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      mockDeleteAssetHandler.mockImplementationOnce(() => {
        throw new Error('delete failed');
      });

      expect(() => deleteAssetStore(paramsWithUint8Array)).toThrow('delete failed');
    });
  });

  describe('deleteAssetsStore', () => {
    const validParams: DeleteAssetsStoreParams = {
      collection
    };

    it('should call __juno_satellite_storage_delete_assets_store with correct params', () => {
      deleteAssetsStore(validParams);
      expect(mockDeleteAssetsHandler).toHaveBeenCalledWith(collection);
    });

    it('should throw ZodError if params are invalid', () => {
      const invalid = {collection: 123} as unknown as DeleteAssetsStoreParams;
      expect(() => deleteAssetsStore(invalid)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      mockDeleteAssetsHandler.mockImplementationOnce(() => {
        throw new Error('bulk delete failed');
      });

      expect(() => deleteAssetsStore(validParams)).toThrow('bulk delete failed');
    });
  });

  describe('deleteFilteredAssetsStore', () => {
    const baseParamsWithUint8Array: DeleteFilteredAssetsStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      params: {}
    };

    const baseParamsWithPrincipal: DeleteFilteredAssetsStoreParams = {
      caller: Principal.anonymous(),
      collection,
      params: {}
    };

    it('should call __juno_satellite_storage_delete_filtered_assets_store with correct params (Uint8Array)', () => {
      const result = deleteFilteredAssetsStore(baseParamsWithUint8Array);

      expect(mockDeleteFilteredAssetsHandler).toHaveBeenCalledWith(
        baseParamsWithUint8Array.caller,
        collection,
        {}
      );
      expect(result).toEqual(mockDeletedAssets);
    });

    it('should call __juno_satellite_storage_delete_filtered_assets_store with caller converted to Uint8Array (Principal)', () => {
      const result = deleteFilteredAssetsStore(baseParamsWithPrincipal);

      expect(mockDeleteFilteredAssetsHandler).toHaveBeenCalledWith(
        (baseParamsWithPrincipal.caller as Principal).toUint8Array(),
        collection,
        {}
      );
      expect(result).toEqual(mockDeletedAssets);
    });

    it('should throw ZodError if input is invalid', () => {
      const invalid = {
        caller: 42,
        collection,
        params: {}
      } as unknown as DeleteFilteredAssetsStoreParams;

      expect(() => deleteFilteredAssetsStore(invalid)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      mockDeleteFilteredAssetsHandler.mockImplementationOnce(() => {
        throw new Error('filtered delete failed');
      });

      expect(() => deleteFilteredAssetsStore(baseParamsWithUint8Array)).toThrow(
        'filtered delete failed'
      );
    });
  });

  describe('setAssetTokenStore', () => {
    const paramsWithUint8Array: SetAssetTokenStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      full_path,
      token: 'super-secret-token-123'
    };

    const paramsWithPrincipal: SetAssetTokenStoreParams = {
      caller: Principal.anonymous(),
      collection,
      full_path,
      token: 'another-token-456'
    };

    const paramsWithUndefinedToken: SetAssetTokenStoreParams = {
      caller: Principal.anonymous(),
      collection,
      full_path,
      token: undefined
    };

    it('should call __juno_satellite_storage_set_asset_token_store with Uint8Array caller', () => {
      setAssetTokenStore(paramsWithUint8Array);
      expect(mockSetAssetTokenHandler).toHaveBeenCalledWith(
        paramsWithUint8Array.caller,
        collection,
        full_path,
        'super-secret-token-123'
      );
    });

    it('should call __juno_satellite_storage_set_asset_token_store with Principal caller converted to Uint8Array', () => {
      setAssetTokenStore(paramsWithPrincipal);
      expect(mockSetAssetTokenHandler).toHaveBeenCalledWith(
        (paramsWithPrincipal.caller as Principal).toUint8Array(),
        collection,
        full_path,
        'another-token-456'
      );
    });

    it('should call __juno_satellite_storage_set_asset_token_store with undefined token', () => {
      setAssetTokenStore(paramsWithUndefinedToken);
      expect(mockSetAssetTokenHandler).toHaveBeenCalledWith(
        (paramsWithUndefinedToken.caller as Principal).toUint8Array(),
        collection,
        full_path,
        undefined
      );
    });

    it('should throw ZodError if params are invalid', () => {
      const invalidParams = {
        caller: 123,
        collection,
        full_path,
        token: 'token'
      } as unknown as SetAssetTokenStoreParams;

      expect(() => setAssetTokenStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw ZodError if token is not a string or undefined', () => {
      const invalidParams = {
        caller: Principal.anonymous(),
        collection,
        full_path,
        token: 123
      } as unknown as SetAssetTokenStoreParams;

      expect(() => setAssetTokenStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      mockSetAssetTokenHandler.mockImplementationOnce(() => {
        throw new Error('set token failed');
      });

      expect(() => setAssetTokenStore(paramsWithUint8Array)).toThrow('set token failed');
    });
  });

  describe('getAssetStore', () => {
    const paramsWithUint8Array: GetAssetStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      full_path
    };

    const paramsWithPrincipal: GetAssetStoreParams = {
      caller: Principal.anonymous(),
      collection,
      full_path
    };

    it('should call with correct params (Uint8Array)', () => {
      const result = getAssetStore(paramsWithUint8Array);
      expect(global.__juno_satellite_storage_get_asset_store).toHaveBeenCalledWith(
        paramsWithUint8Array.caller,
        collection,
        full_path
      );
      expect(result).toBe(mockAsset);
    });

    it('should convert Principal to Uint8Array and call correctly', () => {
      const result = getAssetStore(paramsWithPrincipal);
      expect(global.__juno_satellite_storage_get_asset_store).toHaveBeenCalledWith(
        (paramsWithPrincipal.caller as Principal).toUint8Array(),
        collection,
        full_path
      );
      expect(result).toBe(mockAsset);
    });

    it('should throw ZodError for invalid input', () => {
      const invalid = {
        caller: 42,
        collection,
        full_path
      } as unknown as GetAssetStoreParams;

      expect(() => getAssetStore(invalid)).toThrow(ZodError);
    });

    it('should throw if Satellite fails', () => {
      vi.mocked(global.__juno_satellite_storage_get_asset_store).mockImplementationOnce(() => {
        throw new Error('failed to get');
      });

      expect(() => getAssetStore(paramsWithUint8Array)).toThrow('failed to get');
    });
  });

  describe('listAssetsStore', () => {
    const paramsWithUint8Array: ListAssetsStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      params: {}
    };

    const paramsWithPrincipal: ListAssetsStoreParams = {
      caller: Principal.anonymous(),
      collection,
      params: {}
    };

    it('should call with correct params (Uint8Array)', () => {
      const result = listAssetsStore(paramsWithUint8Array);
      expect(global.__juno_satellite_storage_list_assets_store).toHaveBeenCalledWith(
        paramsWithUint8Array.caller,
        collection,
        {}
      );
      expect(result).toBe(mockListAssets);
    });

    it('should convert Principal to Uint8Array and call correctly', () => {
      const result = listAssetsStore(paramsWithPrincipal);
      expect(global.__juno_satellite_storage_list_assets_store).toHaveBeenCalledWith(
        (paramsWithPrincipal.caller as Principal).toUint8Array(),
        collection,
        {}
      );
      expect(result).toBe(mockListAssets);
    });

    it('should throw ZodError for invalid input', () => {
      const invalid = {
        caller: 42,
        collection,
        params: {}
      } as unknown as ListAssetsStoreParams;

      expect(() => listAssetsStore(invalid)).toThrow(ZodError);
    });

    it('should throw if Satellite fails', () => {
      vi.mocked(global.__juno_satellite_storage_list_assets_store).mockImplementationOnce(() => {
        throw new Error('list failed');
      });

      expect(() => listAssetsStore(paramsWithUint8Array)).toThrow('list failed');
    });
  });

  describe('getContentChunksStore', () => {
    const encoding = {
      modified: 1710000000000n,
      content_chunks: [new Uint8Array([0])],
      total_length: 4n,
      sha256: new Uint8Array(32)
    };

    const validParams: GetContentChunksStoreParams = {
      encoding,
      chunk_index: 0n,
      memory: 'heap'
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should call __juno_satellite_storage_get_content_chunks_store with correct params', () => {
      const result = getContentChunksStore(validParams);

      expect(global.__juno_satellite_storage_get_content_chunks_store).toHaveBeenCalledWith(
        encoding,
        0n,
        'heap'
      );
      expect(result).toEqual(mockChunk);
    });

    it('should return undefined if global call returns undefined', () => {
      vi.mocked(global.__juno_satellite_storage_get_content_chunks_store).mockReturnValueOnce(
        undefined
      );

      const result = getContentChunksStore(validParams);
      expect(result).toBeUndefined();
    });

    it('should throw ZodError for invalid schema', () => {
      const invalidParams = {
        encoding: {},
        chunk_index: 'not-a-bigint',
        memory: 'invalid'
      } as unknown as GetContentChunksStoreParams;

      expect(() => getContentChunksStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw if global call throws', () => {
      vi.mocked(global.__juno_satellite_storage_get_content_chunks_store).mockImplementationOnce(
        () => {
          throw new Error('internal satellite failure');
        }
      );

      expect(() => getContentChunksStore(validParams)).toThrow('internal satellite failure');
    });
  });
});
