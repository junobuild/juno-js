import * as storageModule from '@junobuild/storage';
import * as actorApi from '../../api/actor.api';
import {
  countAssets,
  deleteAsset,
  deleteFilteredAssets,
  deleteManyAssets,
  getAsset,
  getManyAssets,
  listAssets,
  uploadAsset
} from '../../api/storage.api';
import {toListParams} from '../../utils/list.utils';
import {mockIdentity, mockSatelliteId} from '../mocks/mocks';

describe('storage.api', async () => {
  const satellite = {
    identity: mockIdentity,
    satelliteId: mockSatelliteId,
    container: true
  };

  const readOptions = {
    options: {
      certified: false
    }
  };

  const updateOptions = {
    options: {
      certified: true
    }
  };

  const collection = 'test-collection';
  const fullPath = '/test/path.png';

  const mockHtml = '<html><body>Hello</body></html>';

  const mockBlob = new Blob([mockHtml], {
    type: 'text/plain; charset=utf-8'
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('uploadAsset', () => {
    it('calls uploadAssetStorage', async () => {
      const mockUploadAssetStorage = vi
        .spyOn(storageModule, 'uploadAsset')
        .mockResolvedValue(undefined);

      const asset = {collection, fullPath, data: mockBlob} as storageModule.UploadAsset;
      const spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({} as any);

      await uploadAsset({...asset, satellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite, ...updateOptions});

      expect(mockUploadAssetStorage).toHaveBeenCalledOnce();
      expect(mockUploadAssetStorage).toHaveBeenCalledWith({
        actor: {},
        asset
      });
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      const asset = {collection, fullPath, data: mockBlob} as storageModule.UploadAsset;

      await expect(uploadAsset({...asset, satellite})).rejects.toThrow('fail');
    });
  });

  describe('listAssets', () => {
    it('returns formatted assets', async () => {
      const mockListAssets = vi.fn().mockResolvedValue({
        items: [[fullPath, {key: fullPath}]],
        items_length: 1n,
        items_page: null,
        matches_length: 1n,
        matches_pages: null
      });
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({list_assets: mockListAssets} as any);

      const filter = {};
      const expectedListParams = toListParams(filter);

      const result = await listAssets({collection, filter, satellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite, ...readOptions});

      expect(mockListAssets).toHaveBeenCalledOnce();
      expect(mockListAssets).toHaveBeenCalledWith(collection, expectedListParams);

      expect(result.items[0].key).toBe(fullPath);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(listAssets({collection, filter: {}, satellite})).rejects.toThrow('fail');
    });
  });

  describe('countAssets', () => {
    it('returns count', async () => {
      const mockCountAssets = vi.fn().mockResolvedValue(2n);
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({count_assets: mockCountAssets} as any);

      const filter = {};
      const expectedFilter = toListParams(filter);

      const result = await countAssets({collection, filter, satellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite, ...readOptions});

      expect(mockCountAssets).toHaveBeenCalledOnce();
      expect(mockCountAssets).toHaveBeenCalledWith(collection, expectedFilter);

      expect(result).toBe(2n);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(countAssets({collection, filter: {}, satellite})).rejects.toThrow('fail');
    });
  });

  describe('deleteAsset', () => {
    it('calls del_asset', async () => {
      const mockDelAsset = vi.fn().mockResolvedValue(undefined);
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({del_asset: mockDelAsset} as any);

      await deleteAsset({collection, fullPath, satellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite, ...updateOptions});

      expect(mockDelAsset).toHaveBeenCalledOnce();
      expect(mockDelAsset).toHaveBeenCalledWith(collection, fullPath);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(deleteAsset({collection, fullPath, satellite})).rejects.toThrow('fail');
    });
  });

  describe('deleteManyAssets', () => {
    it('calls del_many_assets', async () => {
      const mockDelManyAssets = vi.fn().mockResolvedValue(undefined);
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({del_many_assets: mockDelManyAssets} as any);

      const assets = [{collection, fullPath}];
      const expectedPayload = [[collection, fullPath]];

      await deleteManyAssets({assets, satellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite, ...updateOptions});

      expect(mockDelManyAssets).toHaveBeenCalledOnce();
      expect(mockDelManyAssets).toHaveBeenCalledWith(expectedPayload);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(deleteManyAssets({assets: [{collection, fullPath}], satellite})).rejects.toThrow(
        'fail'
      );
    });
  });

  describe('deleteFilteredAssets', () => {
    it('calls del_filtered_assets', async () => {
      const mockDelFilteredAssets = vi.fn().mockResolvedValue(undefined);
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({del_filtered_assets: mockDelFilteredAssets} as any);

      const filter = {};
      const expectedFilter = toListParams(filter);

      await deleteFilteredAssets({collection, filter, satellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite, ...updateOptions});

      expect(mockDelFilteredAssets).toHaveBeenCalledOnce();
      expect(mockDelFilteredAssets).toHaveBeenCalledWith(collection, expectedFilter);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(deleteFilteredAssets({collection, filter: {}, satellite})).rejects.toThrow(
        'fail'
      );
    });
  });

  describe('getAsset', () => {
    it('returns asset', async () => {
      const mockGetAsset = vi.fn().mockResolvedValue([{key: fullPath}]);
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({get_asset: mockGetAsset} as any);

      const result = await getAsset({collection, fullPath, satellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite, ...readOptions});

      expect(mockGetAsset).toHaveBeenCalledOnce();
      expect(mockGetAsset).toHaveBeenCalledWith(collection, fullPath);

      expect(result?.key).toBe(fullPath);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(getAsset({collection, fullPath, satellite})).rejects.toThrow('fail');
    });
  });

  describe('getManyAssets', () => {
    it('returns multiple assets', async () => {
      const mockGetManyAssets = vi.fn().mockResolvedValue([[fullPath, [{key: fullPath}]]]);
      const spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({get_many_assets: mockGetManyAssets} as any);

      const assets = [{collection, fullPath}];
      const expectedPayload = [[collection, fullPath]];

      const result = await getManyAssets({assets, satellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite, ...readOptions});

      expect(mockGetManyAssets).toHaveBeenCalledOnce();
      expect(mockGetManyAssets).toHaveBeenCalledWith(expectedPayload);

      expect(result[0]?.key).toBe(fullPath);
    });

    it('bubbles error', async () => {
      vi.spyOn(actorApi, 'getSatelliteActor').mockRejectedValue(new Error('fail'));

      await expect(getManyAssets({assets: [{collection, fullPath}], satellite})).rejects.toThrow(
        'fail'
      );
    });
  });
});
