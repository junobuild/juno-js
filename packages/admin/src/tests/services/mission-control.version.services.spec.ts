import type {CanisterStatus} from '@icp-sdk/core/agent';
import * as agent from '@icp-sdk/core/agent';
import {JUNO_PACKAGE_MISSION_CONTROL_ID, JUNO_PACKAGE_SATELLITE_ID} from '@junobuild/config';
import type {MissionControlParameters} from '@junobuild/ic-client/actor';
import * as actor from '@junobuild/ic-client/actor';
import {MissionControlVersionError} from '../../errors/version.errors';
import {missionControlVersion} from '../../services/mission-control.version.services';
import {mockHttpAgent, mockIdentity, mockSatelliteIdText} from '../mocks/admin.mock';

vi.mock('@icp-sdk/core/agent', () => {
  return {
    CanisterStatus: {
      request: vi.fn()
    }
  };
});

vi.mock(import('@junobuild/ic-client/actor'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getMissionControlActor: vi.fn(),
    getDeprecatedMissionControlVersionActor: vi.fn()
  };
});

const mockActor = {
  version: vi.fn()
};

describe('mission-control.version.services', () => {
  const missionControl: MissionControlParameters = {
    missionControlId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    // @ts-ignore
    vi.mocked(actor.getDeprecatedMissionControlVersionActor).mockResolvedValue(mockActor);
  });

  it('returns version from package if name matches mission control ID', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: JUNO_PACKAGE_MISSION_CONTROL_ID,
        version: '0.0.15',
        dependencies: {}
      })
    );
    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    const result = await missionControlVersion({missionControl});
    expect(result).toBe('0.0.15');
  });

  it('falls back to legacy version if metadata is nullish', async () => {
    const metadataMock = vi.fn().mockReturnValue(undefined);
    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    mockActor.version.mockResolvedValue('0.11.0');

    const result = await missionControlVersion({missionControl});
    expect(result).toBe('0.11.0');
  });

  it('throws if package is not mission control', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: JUNO_PACKAGE_SATELLITE_ID,
        version: '0.1.15',
        dependencies: {}
      })
    );
    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    await expect(missionControlVersion({missionControl})).rejects.toThrow(
      MissionControlVersionError
    );
  });

  it('throws if missionControlId is missing', async () => {
    const missionControl: MissionControlParameters = {
      missionControlId: undefined,
      identity: mockIdentity,
      agent: mockHttpAgent
    };

    await expect(missionControlVersion({missionControl})).rejects.toThrow(
      'A Mission Control ID must be provided to request its version.'
    );
  });
});
