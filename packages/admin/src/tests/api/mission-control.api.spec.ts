import {Principal} from '@dfinity/principal';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {SetController} from '../../../declarations/mission_control/mission_control.did';
import * as actor from '../../api/_actor.api';
import * as missionControlApi from '../../api/mission-control.api';
import {mockIdentity} from '../mocks/mocks';

vi.mock('../../api/_actor.api', () => ({
  getMissionControlActor: vi.fn(),
  getDeprecatedMissionControlVersionActor: vi.fn()
}));

const mockPrincipal = Principal.fromText('aaaaa-aa');
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
      const result = await missionControlApi.version({missionControl: {identity: mockIdentity}});
      expect(result).toBe('0.0.1');
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.version.mockRejectedValueOnce(err);
      await expect(
        missionControlApi.version({missionControl: {identity: mockIdentity}})
      ).rejects.toThrow(err);
    });
  });

  describe('getUser', () => {
    it('returns the principal', async () => {
      mockActor.get_user.mockResolvedValue(mockPrincipal);
      const result = await missionControlApi.getUser({missionControl: {identity: mockIdentity}});
      expect(result).toBe(mockPrincipal);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.get_user.mockRejectedValueOnce(err);
      await expect(
        missionControlApi.getUser({missionControl: {identity: mockIdentity}})
      ).rejects.toThrow(err);
    });
  });

  describe('listControllers', () => {
    it('returns controller list', async () => {
      const data = [[mockPrincipal, {}]];
      mockActor.list_mission_control_controllers.mockResolvedValue(data);
      const result = await missionControlApi.listControllers({
        missionControl: {identity: mockIdentity}
      });
      expect(result).toEqual(data);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.list_mission_control_controllers.mockRejectedValueOnce(err);
      await expect(
        missionControlApi.listControllers({missionControl: {identity: mockIdentity}})
      ).rejects.toThrow(err);
    });
  });

  describe('setSatellitesController', () => {
    it('sets satellites controller', async () => {
      const result = {};
      mockActor.set_satellites_controllers.mockResolvedValue(result);
      const satelliteIds = [mockPrincipal];
      const controllerIds = [mockPrincipal];

      const res = await missionControlApi.setSatellitesController({
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
        missionControlApi.setSatellitesController({
          missionControl: {identity: mockIdentity},
          satelliteIds: [mockPrincipal],
          controllerIds: [mockPrincipal],
          controller
        })
      ).rejects.toThrow(err);
    });
  });

  describe('setMissionControlController', () => {
    it('sets mission control controller', async () => {
      const result = {};
      mockActor.set_mission_control_controllers.mockResolvedValue(result);
      const controllerIds = [mockPrincipal];

      const res = await missionControlApi.setMissionControlController({
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
        missionControlApi.setMissionControlController({
          missionControl: {identity: mockIdentity},
          controllerIds: [mockPrincipal],
          controller
        })
      ).rejects.toThrow(err);
    });
  });
});
