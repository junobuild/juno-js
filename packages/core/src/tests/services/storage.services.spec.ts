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
  uploadBlob
} from '../../services/storage.services';
import {mockIdentity, mockSatelliteId, mockUserIdPrincipal} from '../mocks/mocks';

describe('storage.services', () => {
  const satellite = {identity: mockIdentity, satelliteId: mockSatelliteId, container: true};
  const collection = 'test-collection';
  const fullPath = '/test/path.png';
  const mockBlob = new Blob(['test'], {type: 'text/plain'});

  const asset = {collection, fullPath, data: mockBlob} as storageModule.UploadAsset;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uploadBlob calls uploadAsset', async () => {
    const mockUploadAssetStorage = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({} as any);
    vi.spyOn(storageModule, 'uploadAsset').mockImplementation(async ({actor, asset}) => {
      mockUploadAssetStorage(actor, asset);
      return;
    });

    await uploadBlob(asset);

    expect(actorApi.getSatelliteActor).toHaveBeenCalledOnce();
    expect(mockUploadAssetStorage).toHaveBeenCalledOnce();
  });

  it('listAssets returns formatted assets', async () => {
    const mockListAssets = vi.fn().mockResolvedValue({
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

    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({list_assets: mockListAssets} as any);

    const result = await listAssets({collection, filter: {}, satellite});

    expect(result.items[0].fullPath).toBe(fullPath);
  });

  it('countAssets returns count', async () => {
    const mockCountAssets = vi.fn().mockResolvedValue(2n);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      count_assets: mockCountAssets
    } as any);

    const result = await countAssets({collection, filter: {}, satellite});

    expect(result).toBe(2n);
  });

  it('deleteAsset calls del_asset', async () => {
    const mockDelAsset = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({del_asset: mockDelAsset} as any);

    await deleteAsset({collection, fullPath, satellite});

    expect(mockDelAsset).toHaveBeenCalledOnce();
  });

  it('deleteManyAssets calls del_many_assets', async () => {
    const mockDelManyAssets = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      del_many_assets: mockDelManyAssets
    } as any);

    await deleteManyAssets({assets: [{collection, fullPath}], satellite});

    expect(mockDelManyAssets).toHaveBeenCalledOnce();
  });

  it('deleteFilteredAssets calls del_filtered_assets', async () => {
    const mockDelFilteredAssets = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      del_filtered_assets: mockDelFilteredAssets
    } as any);

    await deleteFilteredAssets({collection, filter: {}, satellite});

    expect(mockDelFilteredAssets).toHaveBeenCalledOnce();
  });

  it('getAsset returns asset', async () => {
    const mockGetAsset = vi.fn().mockResolvedValue([{key: {full_path: fullPath}}]);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({get_asset: mockGetAsset} as any);

    const result = await getAsset({collection, fullPath, satellite});

    expect(result?.key?.full_path).toBe(fullPath);
  });

  it('getManyAssets returns multiple assets', async () => {
    const mockGetManyAssets = vi
      .fn()
      .mockResolvedValue([[fullPath, [{key: {full_path: fullPath}}]]]);
    vi.spyOn(actorApi, 'getSatelliteActor').mockResolvedValue({
      get_many_assets: mockGetManyAssets
    } as any);

    const result = await getManyAssets({
      assets: [{collection, fullPath}],
      satellite
    });

    expect(result[0]?.key?.full_path).toBe(fullPath);
  });
});
