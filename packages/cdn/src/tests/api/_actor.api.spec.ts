import {CdnParameters} from '@junobuild/cdn';
import type {ConsoleActor, SatelliteActor} from '@junobuild/ic-client';
import * as icClient from '@junobuild/ic-client';
import {getCdnActor} from '../../api/_actor.api';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/cdn.mock';

vi.mock('@junobuild/ic-client', () => {
  return {
    getConsoleActor: vi.fn(),
    getSatelliteActor: vi.fn()
  };
});

describe('getCdnActor', () => {
  const mockConsoleActor = {} as unknown as ConsoleActor;
  const mockSatelliteActor = {} as unknown as SatelliteActor;

  beforeEach(() => {
    vi.restoreAllMocks();

    vi.mocked(icClient.getConsoleActor).mockResolvedValue(mockConsoleActor);
    vi.mocked(icClient.getSatelliteActor).mockResolvedValue(mockSatelliteActor);
  });

  it('returns a Satellite actor when cdn has "satellite"', async () => {
    const params: CdnParameters = {
      satellite: {satelliteId: mockSatelliteIdPrincipal, identity: mockIdentity}
    };

    const actor = await getCdnActor(params);

    expect(icClient.getSatelliteActor).toHaveBeenCalledOnce();
    expect(icClient.getSatelliteActor).toHaveBeenCalledWith(params.satellite);
    expect(icClient.getConsoleActor).not.toHaveBeenCalled();

    expect(actor).toBe(mockSatelliteActor);
  });

  it('returns a Console actor when cdn has "console"', async () => {
    const params: CdnParameters = {
      console: {consoleId: mockSatelliteIdPrincipal, identity: mockIdentity}
    };

    const actor = await getCdnActor(params);

    expect(icClient.getConsoleActor).toHaveBeenCalledOnce();
    expect(icClient.getConsoleActor).toHaveBeenCalledWith(params.console);
    expect(icClient.getSatelliteActor).not.toHaveBeenCalled();

    expect(actor).toBe(mockConsoleActor);
  });
});
