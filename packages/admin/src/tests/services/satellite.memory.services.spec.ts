import * as actor from '@junobuild/ic-client';
import {satelliteMemorySize} from '../../services/satellite.memory.services';
import {mockHttpAgent, mockIdentity, mockSatelliteIdText} from '../mocks/admin.mock';

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSatelliteActor: vi.fn()
  };
});

const mockActor = {
  memory_size: vi.fn()
};

describe('satellite.memory.services', () => {
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

  it('returns memory size from the satellite actor', async () => {
    const mockSize = {
      heap_size: 4096n,
      stable_size: 8192n
    };

    mockActor.memory_size.mockResolvedValue(mockSize);

    const result = await satelliteMemorySize({satellite});

    expect(mockActor.memory_size).toHaveBeenCalled();
    expect(result).toEqual(mockSize);
  });
});
