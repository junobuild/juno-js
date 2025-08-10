import {SetControllersArgs} from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';
import * as actor from '../../api/_actor.api';
import {
  listSatelliteControllers,
  setSatelliteControllers
} from '../../services/satellite.controllers.services';
import {
  mockHttpAgent,
  mockIdentity,
  mockSatelliteIdText,
  mockUserIdPrincipal
} from '../mocks/admin.mock';
import {mockController, mockControllers} from '../mocks/modules.mock';

vi.mock('../../api/_actor.api', () => ({
  getSatelliteActor: vi.fn(),
  getDeprecatedSatelliteNoScopeActor: vi.fn()
}));

const mockActor = {
  list_controllers: vi.fn(),
  set_controllers: vi.fn()
};

const mockDeprecatedActor = {
  list_controllers: vi.fn()
};

const satellite = {
  satelliteId: mockSatelliteIdText,
  identity: mockIdentity,
  agent: mockHttpAgent
};

describe('satellite.controllers.services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getSatelliteActor).mockResolvedValue(mockActor);
    // @ts-ignore
    vi.mocked(actor.getDeprecatedSatelliteNoScopeActor).mockResolvedValue(mockDeprecatedActor);
  });

  it('lists controllers from the default satellite actor', async () => {
    mockActor.list_controllers.mockResolvedValue(mockControllers);

    const result = await listSatelliteControllers({satellite});

    expect(mockActor.list_controllers).toHaveBeenCalled();
    expect(result).toEqual(mockControllers);
  });

  it('lists controllers using the deprecated no-scope actor', async () => {
    mockDeprecatedActor.list_controllers.mockResolvedValue(mockControllers);

    const result = await listSatelliteControllers({
      satellite,
      deprecatedNoScope: true
    });

    expect(result).toEqual(mockControllers);
    expect(mockDeprecatedActor.list_controllers).toHaveBeenCalled();
  });

  it('sets controllers using the satellite actor', async () => {
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

    const args: SetControllersArgs = {
      controller: mockController,
      controllers: [mockUserIdPrincipal]
    };

    const result = await setSatelliteControllers({
      satellite,
      args
    });

    expect(mockActor.set_controllers).toHaveBeenCalledWith(args);
    expect(result).toEqual(expectedResponse);
  });
});
