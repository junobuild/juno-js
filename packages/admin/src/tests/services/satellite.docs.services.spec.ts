import * as actor from '@junobuild/ic-client';
import {countDocs, deleteDocs} from '../../services/satellite.docs.services';
import {mockHttpAgent, mockIdentity, mockSatelliteIdText} from '../mocks/admin.mock';

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSatelliteActor: vi.fn()
  };
});

const mockActor = {
  count_collection_docs: vi.fn(),
  del_docs: vi.fn()
};

describe('satellite.docs.services', () => {
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

  it('calls count_collection_docs and returns the result', async () => {
    mockActor.count_collection_docs.mockResolvedValue(42n);

    const result = await countDocs({collection: 'my-docs', satellite});

    expect(mockActor.count_collection_docs).toHaveBeenCalledWith('my-docs');
    expect(result).toBe(42n);
  });

  it('calls del_docs with the collection name', async () => {
    mockActor.del_docs.mockResolvedValue(undefined);

    await deleteDocs({collection: 'my-docs', satellite});

    expect(mockActor.del_docs).toHaveBeenCalledWith('my-docs');
  });
});
