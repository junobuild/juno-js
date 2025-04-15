import {Principal} from '@dfinity/principal';
import {ZodError} from 'zod';
import {CountAssetsStoreParams, CountCollectionAssetsStoreParams} from '../../sdk/schemas/storage';
import {countAssetsStore, countCollectionAssetsStore} from '../../sdk/storage.sdk';

const mockCount = 669n;

vi.stubGlobal(
  '__juno_satellite_storage_count_collection_assets_store',
  vi.fn(() => mockCount)
);
vi.stubGlobal(
  '__juno_satellite_storage_count_assets_store',
  vi.fn(() => mockCount)
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
});
