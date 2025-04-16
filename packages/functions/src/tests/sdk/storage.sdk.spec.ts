import {Principal} from '@dfinity/principal';
import {ZodError} from 'zod';
import {
  CountAssetsStoreParams,
  CountCollectionAssetsStoreParams,
  DeleteAssetsStoreParams,
  DeleteAssetStoreParams,
  DeleteFilteredAssetsStoreParams,
  SetAssetHandlerParams
} from '../../sdk/schemas/storage';
import {
  countAssetsStore,
  countCollectionAssetsStore,
  deleteAssetsStore,
  deleteAssetStore,
  deleteFilteredAssetsStore,
  setAssetHandler
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
});
