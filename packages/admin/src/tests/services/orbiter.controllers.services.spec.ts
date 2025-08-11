import * as actor from '@junobuild/ic-client';
import {OrbiterDid} from '@junobuild/ic-client';
import {listOrbiterControllers} from '../../services/orbiter.controllers.services';
import {
  mockHttpAgent,
  mockIdentity,
  mockSatelliteIdPrincipal,
  mockSatelliteIdText
} from '../mocks/admin.mock';

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getOrbiterActor: vi.fn(),
    getDeprecatedOrbiterVersionActor: vi.fn()
  };
});

const mockActor = {
  list_controllers: vi.fn()
};

describe('orbiter.controllers.services', () => {
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

  it('returns the list of controllers from the orbiter actor', async () => {
    const controller: OrbiterDid.Controller = {
      updated_at: 123n,
      metadata: [],
      created_at: 4456n,
      scope: {Admin: null},
      expires_at: []
    };

    const mockControllers = [[mockSatelliteIdPrincipal, controller]];
    mockActor.list_controllers.mockResolvedValue(mockControllers);

    const result = await listOrbiterControllers({orbiter});

    expect(result).toEqual(mockControllers);
    expect(mockActor.list_controllers).toHaveBeenCalled();
  });
});
