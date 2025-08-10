import * as actor from '@junobuild/ic-client';
import {countAssets, deleteAssets} from '../../services/satellite.assets.services';
import {mockHttpAgent, mockIdentity, mockSatelliteIdText} from '../mocks/admin.mock';

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSatelliteActor: vi.fn()
  };
});

const mockActor = {
  count_collection_assets: vi.fn(),
  del_assets: vi.fn()
};

describe('satellite.assets.services', () => {
  const satellite = {
    satelliteId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
  });

  it('calls count_collection_assets and returns the result', async () => {
    mockActor.count_collection_assets.mockResolvedValue(7n);

    const result = await countAssets({collection: 'foo', satellite});

    expect(mockActor.count_collection_assets).toHaveBeenCalledWith('foo');
    expect(result).toBe(7n);
  });

  it('calls del_assets with the collection name', async () => {
    mockActor.del_assets.mockResolvedValue(undefined);

    await deleteAssets({collection: 'foo', satellite});

    expect(mockActor.del_assets).toHaveBeenCalledWith('foo');
  });
});
