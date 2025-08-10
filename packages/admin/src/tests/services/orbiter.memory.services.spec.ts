import * as actor from '@junobuild/ic-client';
import {orbiterMemorySize} from '../../services/orbiter.memory.services';
import {mockHttpAgent, mockIdentity, mockSatelliteIdText} from '../mocks/admin.mock';

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getOrbiterActor: vi.fn(),
    getDeprecatedOrbiterVersionActor: vi.fn()
  };
});

const mockActor = {
  memory_size: vi.fn()
};

describe('orbiter.memory-size.services', () => {
  const orbiter = {
    orbiterId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getOrbiterActor).mockResolvedValue(mockActor);
  });

  it('returns memory size from the orbiter actor', async () => {
    const mockSize = {
      heap_size: 1024n,
      stable_size: 2048n
    };

    mockActor.memory_size.mockResolvedValue(mockSize);

    const result = await orbiterMemorySize({orbiter});

    expect(result).toEqual(mockSize);
    expect(mockActor.memory_size).toHaveBeenCalled();
  });
});
