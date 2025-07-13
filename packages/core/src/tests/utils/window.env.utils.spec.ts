import {envSatelliteId} from '../../utils/window.env.utils';
import {mockSatelliteId} from '../mocks/mocks';

describe('window.env.utils', () => {
  describe('process', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = {...originalEnv, NEXT_PUBLIC_SATELLITE_ID: mockSatelliteId};
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('returns NEXT_PUBLIC_SATELLITE_ID from process.env if defined', () => {
      vi.stubGlobal('process', {env: {NEXT_PUBLIC_SATELLITE_ID: mockSatelliteId}});

      expect(envSatelliteId()).toBe(mockSatelliteId);
    });
  });

  // StubGlobal does not mock import.env.meta
  it.skip('returns VITE_SATELLITE_ID from import.meta.env if process.env is undefined', () => {
    vi.stubGlobal('importMeta', {env: {VITE_SATELLITE_ID: mockSatelliteId}});

    expect(envSatelliteId()).toBe(mockSatelliteId);
  });

  it('returns undefined if neither process.env nor import.meta.env are defined', () => {
    expect(envSatelliteId()).toBeUndefined();
  });
});
