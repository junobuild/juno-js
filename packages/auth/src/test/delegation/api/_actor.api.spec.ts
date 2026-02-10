import type {ConsoleActor, SatelliteActor} from '@junobuild/ic-client/actor';
import * as icClient from '@junobuild/ic-client/actor';
import {getAuthActor} from '../../../delegation/api/_actor.api';
import {AuthParameters} from '../../../delegation/types/actor';
import {mockIdentity} from '../../mocks/identity.mock';
import {mockSatelliteIdPrincipal} from '../../mocks/principal.mock';

vi.mock('@junobuild/ic-client/actor', () => {
  return {
    getConsoleActor: vi.fn(),
    getSatelliteActor: vi.fn()
  };
});

describe('getAuthActor', () => {
  const mockConsoleActor = {} as unknown as ConsoleActor;
  const mockSatelliteActor = {} as unknown as SatelliteActor;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();

    vi.mocked(icClient.getConsoleActor).mockResolvedValue(mockConsoleActor);
    vi.mocked(icClient.getSatelliteActor).mockResolvedValue(mockSatelliteActor);
  });

  it('should return a Satellite actor when cdn has "satellite"', async () => {
    const auth: AuthParameters = {
      satellite: {satelliteId: mockSatelliteIdPrincipal}
    };

    const actor = await getAuthActor({auth, identity: mockIdentity});

    expect(icClient.getSatelliteActor).toHaveBeenCalledOnce();
    expect(icClient.getSatelliteActor).toHaveBeenCalledWith({
      ...auth.satellite,
      identity: mockIdentity
    });
    expect(icClient.getConsoleActor).not.toHaveBeenCalled();

    expect(actor).toBe(mockSatelliteActor);
  });

  it('should return a Console actor when cdn has "console"', async () => {
    const auth: AuthParameters = {
      console: {consoleId: mockSatelliteIdPrincipal}
    };

    const actor = await getAuthActor({auth, identity: mockIdentity});

    expect(icClient.getConsoleActor).toHaveBeenCalledOnce();
    expect(icClient.getConsoleActor).toHaveBeenCalledWith({
      ...auth.console,
      identity: mockIdentity
    });
    expect(icClient.getSatelliteActor).not.toHaveBeenCalled();

    expect(actor).toBe(mockConsoleActor);
  });
});
