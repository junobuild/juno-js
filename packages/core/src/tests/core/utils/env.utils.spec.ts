import {EnvStore} from '../../../core/stores/env.store';
import {
  customOrEnvContainer,
  customOrEnvSatelliteId,
  satelliteUrl
} from '../../../core/utils/env.utils';
import {mockIdentity, mockSatelliteId, mockUserIdText} from '../../mocks/core.mock';

describe('env.utils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns container-based URL with custom satelliteId and container', () => {
    const url = satelliteUrl({
      satelliteId: mockSatelliteId,
      container: 'http://127.0.0.1:5987',
      identity: mockIdentity
    });

    expect(url).toBe(`http://${mockSatelliteId}.localhost:5987`);
  });

  it('returns icp0.io URL if no container provided', () => {
    const url = satelliteUrl({
      satelliteId: mockSatelliteId,
      container: undefined,
      identity: mockIdentity
    });

    expect(url).toBe(`https://${mockSatelliteId}.icp0.io`);
  });

  it('falls back to EnvStore if satelliteId is undefined', () => {
    vi.spyOn(EnvStore, 'getInstance').mockReturnValue({
      get: () => ({satelliteId: mockSatelliteId, container: undefined})
    } as any);

    const url = satelliteUrl({
      satelliteId: undefined,
      container: undefined,
      identity: mockIdentity
    });

    expect(url).toBe(`https://${mockSatelliteId}.icp0.io`);
  });

  it('falls back to EnvStore if container is undefined', () => {
    vi.spyOn(EnvStore, 'getInstance').mockReturnValue({
      get: () => ({satelliteId: mockSatelliteId, container: 'http://127.0.0.1:5987'})
    } as any);

    const url = satelliteUrl({
      satelliteId: mockSatelliteId,
      identity: mockIdentity,
      container: undefined
    });

    expect(url).toBe(`http://${mockSatelliteId}.localhost:5987`);
  });
});

describe('customOrEnvSatelliteId', () => {
  it('returns custom satelliteId if provided', () => {
    expect(customOrEnvSatelliteId({satelliteId: mockUserIdText})).toEqual({
      satelliteId: mockUserIdText
    });
  });

  it('returns EnvStore satelliteId if undefined', () => {
    vi.spyOn(EnvStore, 'getInstance').mockReturnValue({
      get: () => ({satelliteId: mockUserIdText})
    } as any);

    expect(customOrEnvSatelliteId({satelliteId: undefined})).toEqual({satelliteId: mockUserIdText});
  });
});

describe('customOrEnvContainer', () => {
  it('returns custom container if provided', () => {
    expect(customOrEnvContainer({container: 'http://test'})).toEqual({container: 'http://test'});
  });

  it('returns EnvStore container if undefined', () => {
    vi.spyOn(EnvStore, 'getInstance').mockReturnValue({
      get: () => ({container: 'http://env'})
    } as any);

    expect(customOrEnvContainer({container: undefined})).toEqual({container: 'http://env'});
  });
});
