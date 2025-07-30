import * as storageModule from '@junobuild/storage';
import type {Mock, MockInstance} from 'vitest';
import * as actorApi from '../../api/actor.api';
import {
  countAssets,
  deleteAsset,
  deleteFilteredAssets,
  deleteManyAssets,
  getAsset,
  getManyAssets,
  listAssets,
  uploadBlob,
  uploadFile
} from '../../services/storage.services';
import {
  mockReadOptions,
  mockSatellite,
  mockUpdateOptions,
  mockUserIdPrincipal
} from '../mocks/core.mock';

describe('storage.services', () => {
  const collection = 'test-collection';
  const fullPath = '/test/path.png';
  const mockBlob = new Blob(['test'], {type: 'text/plain'});

  const asset = {collection, fullPath, data: mockBlob} as storageModule.UploadAsset;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('upload', () => {
    let mockUploadAssetStorage: Mock;

    beforeEach(() => {
      mockUploadAssetStorage = vi.fn().mockResolvedValue(undefined);

      vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({} as any);
      vi.spyOn(storageModule, 'uploadAsset').mockImplementation(async ({actor, asset}) => {
        mockUploadAssetStorage(actor, asset);
        return;
      });
    });

    it('uploadBlob calls uploadAsset', async () => {
      await uploadBlob(asset);

      expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
      expect(mockUploadAssetStorage).toHaveBeenCalledOnce();
    });

    it('uploadFile calls uploadAsset', async () => {
      const asset = {collection, fullPath, data: new File([mockBlob], 'name.txt')};

      await uploadFile(asset);

      expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
      expect(mockUploadAssetStorage).toHaveBeenCalledOnce();
    });
  });

  describe('listAssets', () => {
    let mockListAssets: MockInstance;
    let spy: MockInstance;

    beforeEach(() => {
      mockListAssets = vi.fn().mockResolvedValue({
        items: [
          [
            fullPath,
            {
              key: {
                full_path: fullPath,
                name: 'file.png',
                owner: mockUserIdPrincipal,
                token: [],
                description: []
              },
              headers: [],
              encodings: [['identity', {modified: 0n, sha256: new Uint8Array(), total_length: 0n}]],
              created_at: 0n,
              updated_at: 0n
            }
          ]
        ],
        items_length: 1n,
        matches_length: 1n
      });

      spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        list_assets: mockListAssets
      } as any);
    });

    it('call and return', async () => {
      const result = await listAssets({collection, filter: {}, satellite: mockSatellite});

      expect(result.items[0].fullPath).toBe(fullPath);
      expect(result).toEqual({
        assets: [
          {
            created_at: 0n,
            description: undefined,
            downloadUrl: 'http://jx5yt-yyaaa-aaaal-abzbq-cai.localhost:5987/test/path.png',
            encodings: {
              identity: {
                modified: 0n,
                sha256: '',
                total_length: 0n
              }
            },
            fullPath: '/test/path.png',
            headers: [],
            name: 'file.png',
            owner: 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe',
            token: undefined,
            updated_at: 0n
          }
        ],
        items: [
          {
            created_at: 0n,
            description: undefined,
            downloadUrl: 'http://jx5yt-yyaaa-aaaal-abzbq-cai.localhost:5987/test/path.png',
            encodings: {
              identity: {
                modified: 0n,
                sha256: '',
                total_length: 0n
              }
            },
            fullPath: '/test/path.png',
            headers: [],
            name: 'file.png',
            owner: 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe',
            token: undefined,
            updated_at: 0n
          }
        ],
        items_length: 1n,
        items_page: undefined,
        matches_length: 1n,
        matches_pages: undefined
      });
    });

    it('with query by default', async () => {
      await listAssets({
        collection,
        filter: {},
        satellite: mockSatellite
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with query', async () => {
      await listAssets({
        collection,
        filter: {},
        satellite: mockSatellite,
        options: {certified: false}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with update', async () => {
      await listAssets({
        collection,
        filter: {},
        satellite: mockSatellite,
        options: {certified: true}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
    });
  });

  describe('countAssets', () => {
    let mockCountAssets: MockInstance;
    let spy: MockInstance;

    beforeEach(() => {
      mockCountAssets = vi.fn().mockResolvedValue(2n);
      spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        count_assets: mockCountAssets
      } as any);
    });

    it('call and return', async () => {
      const result = await countAssets({collection, filter: {}, satellite: mockSatellite});

      expect(result).toBe(2n);
    });

    it('with query by default', async () => {
      await countAssets({
        collection,
        filter: {},
        satellite: mockSatellite
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with query', async () => {
      await countAssets({
        collection,
        filter: {},
        satellite: mockSatellite,
        options: {certified: false}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with update', async () => {
      await countAssets({
        collection,
        filter: {},
        satellite: mockSatellite,
        options: {certified: true}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
    });
  });

  it('deleteAsset calls del_asset', async () => {
    const mockDelAsset = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({del_asset: mockDelAsset} as any);

    await deleteAsset({collection, fullPath, satellite: mockSatellite});

    expect(mockDelAsset).toHaveBeenCalledOnce();
  });

  it('deleteManyAssets calls del_many_assets', async () => {
    const mockDelManyAssets = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      del_many_assets: mockDelManyAssets
    } as any);

    await deleteManyAssets({assets: [{collection, fullPath}], satellite: mockSatellite});

    expect(mockDelManyAssets).toHaveBeenCalledOnce();
  });

  it('deleteFilteredAssets calls del_filtered_assets', async () => {
    const mockDelFilteredAssets = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      del_filtered_assets: mockDelFilteredAssets
    } as any);

    await deleteFilteredAssets({collection, filter: {}, satellite: mockSatellite});

    expect(mockDelFilteredAssets).toHaveBeenCalledOnce();
  });

  describe('getAsset', () => {
    let mockGetAsset: MockInstance;
    let spy: MockInstance;

    beforeEach(() => {
      mockGetAsset = vi.fn().mockResolvedValue([{key: {full_path: fullPath}}]);
      spy = vi
        .spyOn(actorApi, 'getSatelliteActor')
        .mockResolvedValue({get_asset: mockGetAsset} as any);
    });

    it('call and return', async () => {
      const result = await getAsset({collection, fullPath, satellite: mockSatellite});

      expect(result?.key?.full_path).toBe(fullPath);
    });

    it('with query by default', async () => {
      await getAsset({collection, fullPath, satellite: mockSatellite});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with query', async () => {
      await getAsset({collection, fullPath, satellite: mockSatellite, options: {certified: false}});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with update', async () => {
      await getAsset({collection, fullPath, satellite: mockSatellite, options: {certified: true}});

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
    });
  });

  describe('getManyAssets', () => {
    let mockGetManyAssets: MockInstance;
    let spy: MockInstance;

    beforeEach(() => {
      mockGetManyAssets = vi.fn().mockResolvedValue([[fullPath, [{key: {full_path: fullPath}}]]]);
      spy = vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
        get_many_assets: mockGetManyAssets
      } as any);
    });

    it('call and return', async () => {
      const result = await getManyAssets({
        assets: [{collection, fullPath}],
        satellite: mockSatellite
      });

      expect(result[0]?.key?.full_path).toBe(fullPath);
    });

    it('with query by default', async () => {
      await getManyAssets({
        assets: [{collection, fullPath}],
        satellite: mockSatellite
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with query', async () => {
      await getManyAssets({
        assets: [{collection, fullPath}],
        satellite: mockSatellite,
        options: {certified: false}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockReadOptions});
    });

    it('with update', async () => {
      await getManyAssets({
        assets: [{collection, fullPath}],
        satellite: mockSatellite,
        options: {certified: true}
      });

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith({satellite: mockSatellite, ...mockUpdateOptions});
    });
  });
});
