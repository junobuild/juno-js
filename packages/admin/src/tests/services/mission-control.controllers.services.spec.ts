import {Principal} from '@dfinity/principal';
import {Controller} from '@junobuild/ic-client/dist/declarations/mission_control/mission_control.did';
import * as actor from '../../api/_actor.api';
import {
  listMissionControlControllers,
  setMissionControlController,
  setSatellitesController
} from '../../services/mission-control.controllers.services';
import {mockIdentity, mockSatelliteIdPrincipal, mockUserIdText} from '../mocks/admin.mock';

vi.mock('../../api/_actor.api', () => ({
  getMissionControlActor: vi.fn(),
  getDeprecatedMissionControlVersionActor: vi.fn()
}));

const mockActor = {
  version: vi.fn(),
  get_user: vi.fn(),
  list_mission_control_controllers: vi.fn(),
  set_satellites_controllers: vi.fn(),
  set_mission_control_controllers: vi.fn()
};

describe('mission-control.controllers.services', () => {
  const missionControl = {identity: mockIdentity};

  const controllerId = mockUserIdText;

  const profile = 'dev';

  const controllerIds = [controllerId];
  const satelliteIds = [mockSatelliteIdPrincipal];

  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getMissionControlActor).mockResolvedValue(mockActor);
  });

  it('calls the underlying API with mapped params', async () => {
    await setSatellitesController({
      missionControl,
      satelliteIds,
      controllerId,
      profile
    });

    expect(mockActor.set_satellites_controllers).toHaveBeenCalledWith(
      satelliteIds,
      controllerIds.map((id) => Principal.fromText(id)),
      {
        expires_at: [],
        metadata: [['profile', 'dev']],
        scope: {
          Admin: null
        }
      }
    );
  });

  it('calls the underlying API with mapped params', async () => {
    await setMissionControlController({
      missionControl,
      controllerId,
      profile
    });

    expect(mockActor.set_mission_control_controllers).toHaveBeenCalledWith(
      controllerIds.map((id) => Principal.fromText(id)),
      {
        expires_at: [],
        metadata: [['profile', 'dev']],
        scope: {
          Admin: null
        }
      }
    );
  });

  const controller: Controller = {
    updated_at: 123n,
    metadata: [],
    created_at: 4456n,
    scope: {Admin: null},
    expires_at: []
  };

  it('delegates to listControllers API', async () => {
    const result = [[controllerId, controller]];
    mockActor.list_mission_control_controllers.mockResolvedValue(result);

    const res = await listMissionControlControllers({missionControl});
    expect(res).toEqual(result);
    expect(mockActor.list_mission_control_controllers).toHaveBeenCalled();
  });
});
