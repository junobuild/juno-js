import type {CanisterStatus} from '@icp-sdk/core/agent';
import * as agent from '@icp-sdk/core/agent';
import {JUNO_PACKAGE_SATELLITE_ID} from '@junobuild/config';
import type {SatelliteParameters} from '@junobuild/ic-client/actor';
import * as actor from '@junobuild/ic-client/actor';
import {SatelliteMissingDependencyError} from '../../errors/version.errors';
import {satelliteBuildType, satelliteVersion} from '../../services/satellite.version.services';
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
    getSatelliteActor: vi.fn(),
    getDeprecatedSatelliteVersionActor: vi.fn()
  };
});

const mockActor = {
  version: vi.fn()
};

describe('satellite.version.services', () => {
  const satellite: SatelliteParameters = {
    satelliteId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getDeprecatedSatelliteVersionActor).mockResolvedValue(mockActor);
  });

  it('returns version if package is the satellite itself', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: JUNO_PACKAGE_SATELLITE_ID,
        version: '0.1.5',
        dependencies: {}
      })
    );

    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    const result = await satelliteVersion({satellite});
    expect(result).toBe('0.1.5');
  });

  it('returns dependency version if satellite is extended', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: 'some-other-id',
        version: '0.2.1',
        dependencies: {
          [JUNO_PACKAGE_SATELLITE_ID]: '0.1.4'
        }
      })
    );

    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    const result = await satelliteVersion({satellite});
    expect(result).toBe('0.1.4');
  });

  it('falls back to legacy version if metadata is nullish', async () => {
    const metadataMock = vi.fn().mockReturnValue(undefined);

    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    mockActor.version.mockResolvedValue('0.0.21');

    const result = await satelliteVersion({satellite});
    expect(result).toBe('0.0.21');
  });

  it('throws if version not found and no legacy fallback', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: 'custom',
        version: '0.3.0',
        dependencies: {}
      })
    );

    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    await expect(satelliteVersion({satellite})).rejects.toThrow(SatelliteMissingDependencyError);
  });

  it('returns "stock" buildType if name is satellite', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: JUNO_PACKAGE_SATELLITE_ID,
        version: '0.1.6',
        dependencies: {}
      })
    );

    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    const result = await satelliteBuildType({satellite});
    expect(result).toBe('stock');
  });

  it('returns "extended" buildType if satellite has satellite dependency', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: 'custom-satellite',
        version: '0.2.0',
        dependencies: {
          [JUNO_PACKAGE_SATELLITE_ID]: '0.1.9'
        }
      })
    );

    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    const result = await satelliteBuildType({satellite});
    expect(result).toBe('extended');
  });

  it('returns undefined buildType if metadata fallback returns unexpected value', async () => {
    const metadataMock = vi.fn().mockReturnValue(undefined);

    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as CanisterStatus.StatusMap);

    mockActor.version.mockResolvedValue(undefined);

    const result = await satelliteBuildType({satellite});
    expect(result).toBeUndefined();
  });

  it('throws if satelliteId is missing', async () => {
    const satellite: SatelliteParameters = {
      satelliteId: undefined,
      identity: mockIdentity,
      agent: mockHttpAgent
    };

    await expect(satelliteVersion({satellite})).rejects.toThrow(
      'A Satellite ID must be provided to request its version.'
    );
  });
});
