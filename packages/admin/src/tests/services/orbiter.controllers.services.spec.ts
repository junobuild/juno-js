import * as actor from '@junobuild/ic-client/actor';
import {OrbiterDid} from '@junobuild/ic-client/actor';
import {
  listOrbiterControllers,
  setOrbiterControllers
} from '../../services/orbiter.controllers.services';
import {
  mockHttpAgent,
  mockIdentity,
  mockSatelliteIdPrincipal,
  mockSatelliteIdText,
  mockUserIdPrincipal
} from '../mocks/admin.mock';
import {mockController} from '../mocks/modules.mock';

vi.mock(import('@junobuild/ic-client/actor'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getOrbiterActor: vi.fn(),
    getDeprecatedOrbiterVersionActor: vi.fn()
  };
});

const mockActor = {
  list_controllers: vi.fn(),
  set_controllers: vi.fn()
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

  it('sets controllers using the orbiter actor', async () => {
    const expectedResponse = [
      [
        mockUserIdPrincipal,
        {
          updated_at: 1624532800000n,
          metadata: [['key', 'value']],
          created_at: 1624532700000n,
          scope: {Admin: null},
          expires_at: [1624532900000n]
        }
      ]
    ];

    mockActor.set_controllers.mockResolvedValue(expectedResponse);

    const args: OrbiterDid.SetControllersArgs = {
      controller: mockController,
      controllers: [mockUserIdPrincipal]
    };

    const result = await setOrbiterControllers({
      orbiter,
      args
    });

    expect(mockActor.set_controllers).toHaveBeenCalledWith(args);
    expect(result).toEqual(expectedResponse);
  });
});
