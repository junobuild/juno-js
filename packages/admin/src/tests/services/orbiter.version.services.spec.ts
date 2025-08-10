import * as agent from '@dfinity/agent';
import type {StatusMap} from '@dfinity/agent/lib/esm/canisterStatus';
import {JUNO_PACKAGE_ORBITER_ID, JUNO_PACKAGE_SATELLITE_ID} from '@junobuild/config';
import * as actor from '@junobuild/ic-client';
import {OrbiterParameters} from '@junobuild/ic-client';
import {OrbiterVersionError} from '../../errors/version.errors';
import {orbiterVersion} from '../../services/orbiter.version.services';
import {mockHttpAgent, mockIdentity, mockSatelliteIdText} from '../mocks/admin.mock';

vi.mock('@dfinity/agent', () => {
  return {
    CanisterStatus: {
      request: vi.fn()
    }
  };
});

vi.mock(import('@junobuild/ic-client'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getOrbiterActor: vi.fn(),
    getDeprecatedOrbiterVersionActor: vi.fn()
  };
});

const mockActor = {
  version: vi.fn()
};

describe('orbiter.version.services', () => {
  const orbiter: OrbiterParameters = {
    orbiterId: mockSatelliteIdText,
    identity: mockIdentity,
    agent: mockHttpAgent
  };

  beforeEach(() => {
    vi.restoreAllMocks();

    // @ts-ignore
    vi.mocked(actor.getDeprecatedOrbiterVersionActor).mockResolvedValue(mockActor);
  });

  it('returns version from package if name matches orbiter ID', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: JUNO_PACKAGE_ORBITER_ID,
        version: '0.0.15',
        dependencies: {}
      })
    );
    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as StatusMap);

    const result = await orbiterVersion({orbiter});
    expect(result).toBe('0.0.15');
  });

  it('falls back to legacy version if metadata is nullish', async () => {
    const metadataMock = vi.fn().mockReturnValue(undefined);
    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as StatusMap);

    mockActor.version.mockResolvedValue('0.11.0');

    const result = await orbiterVersion({orbiter});
    expect(result).toBe('0.11.0');
  });

  it('throws if package is not orbiter', async () => {
    const metadataMock = vi.fn().mockReturnValue(
      JSON.stringify({
        name: JUNO_PACKAGE_SATELLITE_ID,
        version: '0.1.15',
        dependencies: {}
      })
    );
    vi.spyOn(agent.CanisterStatus, 'request').mockResolvedValue({
      get: metadataMock
    } as unknown as StatusMap);

    await expect(orbiterVersion({orbiter})).rejects.toThrow(OrbiterVersionError);
  });

  it('throws if missionControlId is missing', async () => {
    const orbiter: OrbiterParameters = {
      orbiterId: undefined,
      identity: mockIdentity,
      agent: mockHttpAgent
    };

    await expect(orbiterVersion({orbiter})).rejects.toThrow(
      'An Orbiter ID must be provided to request its version.'
    );
  });
});
