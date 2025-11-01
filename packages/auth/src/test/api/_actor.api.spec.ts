import type {ConsoleActor, SatelliteActor} from '@junobuild/ic-client/actor';
import * as icClient from '@junobuild/ic-client/actor';
import {getAuthActor} from '../../api/_actor.api';
import {AuthParameters} from '../../types/actor';
import {mockIdentity} from '../mocks/identity.mock';
import {mockSatelliteIdPrincipal} from '../mocks/principal.mock';

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
    vi.restoreAllMocks();

    vi.mocked(icClient.getConsoleActor).mockResolvedValue(mockConsoleActor);
    vi.mocked(icClient.getSatelliteActor).mockResolvedValue(mockSatelliteActor);
  });

  it('should return a Satellite actor when cdn has "satellite"', async () => {
    const params: AuthParameters = {
      satellite: {satelliteId: mockSatelliteIdPrincipal, identity: mockIdentity}
    };

    const actor = await getAuthActor(params);

    expect(icClient.getSatelliteActor).toHaveBeenCalledOnce();
    expect(icClient.getSatelliteActor).toHaveBeenCalledWith(params.satellite);
    expect(icClient.getConsoleActor).not.toHaveBeenCalled();

    expect(actor).toBe(mockSatelliteActor);
  });

  it('should return a Console actor when cdn has "console"', async () => {
    const params: AuthParameters = {
      console: {consoleId: mockSatelliteIdPrincipal, identity: mockIdentity}
    };

    const actor = await getAuthActor(params);

    expect(icClient.getConsoleActor).toHaveBeenCalledOnce();
    expect(icClient.getConsoleActor).toHaveBeenCalledWith(params.console);
    expect(icClient.getSatelliteActor).not.toHaveBeenCalled();

    expect(actor).toBe(mockConsoleActor);
  });
});
