import * as actor from '@junobuild/ic-client';
import {SetController} from '@junobuild/ic-client/dist/declarations/mission_control/mission_control.did';
import {
  getUser,
  listControllers,
  setMissionControlController,
  setSatellitesController,
  version
} from '../../api/mission-control.api';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/admin.mock';
import {mockControllers} from '../mocks/modules.mock';

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getMissionControlActor: vi.fn(),
    getDeprecatedMissionControlVersionActor: vi.fn()
  };
});

const mockActor = {
  version: vi.fn(),
  get_user: vi.fn(),
  list_mission_control_controllers: vi.fn(),
  set_satellites_controllers: vi.fn(),
  set_mission_control_controllers: vi.fn()
};

describe('mission_control.api', () => {
  const controller: SetController = {scope: {Admin: null}, expires_at: [], metadata: []};

  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getMissionControlActor).mockResolvedValue(mockActor);
    // @ts-ignore
    vi.mocked(actor.getDeprecatedMissionControlVersionActor).mockResolvedValue(mockActor);
  });

  describe('version', () => {
    it('returns the version string', async () => {
      mockActor.version.mockResolvedValue('0.0.1');
      const result = await version({missionControl: {identity: mockIdentity}});
      expect(result).toBe('0.0.1');
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.version.mockRejectedValueOnce(err);
      await expect(version({missionControl: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('getUser', () => {
    it('returns the principal', async () => {
      mockActor.get_user.mockResolvedValue(mockSatelliteIdPrincipal);
      const result = await getUser({missionControl: {identity: mockIdentity}});
      expect(result).toBe(mockSatelliteIdPrincipal);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.get_user.mockRejectedValueOnce(err);
      await expect(getUser({missionControl: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('listControllers', () => {
    it('returns controller list', async () => {
      mockActor.list_mission_control_controllers.mockResolvedValue(mockControllers);
      const result = await listControllers({
        missionControl: {identity: mockIdentity}
      });
      expect(result).toEqual(mockControllers);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.list_mission_control_controllers.mockRejectedValueOnce(err);
      await expect(listControllers({missionControl: {identity: mockIdentity}})).rejects.toThrow(
        err
      );
    });
  });

  describe('setSatellitesController', () => {
    it('sets satellites controller', async () => {
      const result = {};
      mockActor.set_satellites_controllers.mockResolvedValue(result);
      const satelliteIds = [mockSatelliteIdPrincipal];
      const controllerIds = [mockSatelliteIdPrincipal];

      const res = await setSatellitesController({
        missionControl: {identity: mockIdentity},
        satelliteIds,
        controllerIds,
        controller
      });
      expect(res).toBe(result);
      expect(mockActor.set_satellites_controllers).toHaveBeenCalledWith(
        satelliteIds,
        controllerIds,
        controller
      );
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_satellites_controllers.mockRejectedValueOnce(err);
      await expect(
        setSatellitesController({
          missionControl: {identity: mockIdentity},
          satelliteIds: [mockSatelliteIdPrincipal],
          controllerIds: [mockSatelliteIdPrincipal],
          controller
        })
      ).rejects.toThrow(err);
    });
  });

  describe('setMissionControlController', () => {
    it('sets mission control controller', async () => {
      const result = {};
      mockActor.set_mission_control_controllers.mockResolvedValue(result);
      const controllerIds = [mockSatelliteIdPrincipal];

      const res = await setMissionControlController({
        missionControl: {identity: mockIdentity},
        controllerIds,
        controller
      });
      expect(res).toBe(result);
      expect(mockActor.set_mission_control_controllers).toHaveBeenCalledWith(
        controllerIds,
        controller
      );
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_mission_control_controllers.mockRejectedValueOnce(err);
      await expect(
        setMissionControlController({
          missionControl: {identity: mockIdentity},
          controllerIds: [mockSatelliteIdPrincipal],
          controller
        })
      ).rejects.toThrow(err);
    });
  });
});
