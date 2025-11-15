import {
  envContainer,
  envGoogleClientId,
  envSatelliteId
} from '../../../core/utils/window.env.utils';
import {mockGoogleClientId, mockSatelliteId} from '../../mocks/core.mock';

describe('window.env.utils', () => {
  describe('envSatelliteId', () => {
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

  describe('envContainer', () => {
    const mockContainer = 'http://localhost:6666';

    describe('process', () => {
      const originalEnv = process.env;

      beforeEach(() => {
        process.env = {...originalEnv, NEXT_PUBLIC_CONTAINER: mockContainer};
      });

      afterEach(() => {
        process.env = originalEnv;
      });

      it('returns NEXT_PUBLIC_CONTAINER from process.env if defined', () => {
        vi.stubGlobal('process', {env: {NEXT_PUBLIC_CONTAINER: mockContainer}});

        expect(envContainer()).toBe(mockContainer);
      });
    });

    it.skip('returns VITE_CONTAINER from import.meta.env if process.env is undefined', () => {
      vi.stubGlobal('importMeta', {env: {VITE_CONTAINER: mockContainer}});

      expect(envContainer()).toBe(mockContainer);
    });

    it('returns undefined if neither process.env nor import.meta.env are defined', () => {
      expect(envContainer()).toBeUndefined();
    });
  });

  describe('envGoogleClientId', () => {
    describe('process', () => {
      const originalEnv = process.env;

      beforeEach(() => {
        process.env = {...originalEnv, NEXT_PUBLIC_GOOGLE_CLIENT_ID: mockGoogleClientId};
      });

      afterEach(() => {
        process.env = originalEnv;
      });

      it('returns NEXT_PUBLIC_GOOGLE_CLIENT_ID from process.env if defined', () => {
        vi.stubGlobal('process', {env: {NEXT_PUBLIC_GOOGLE_CLIENT_ID: mockGoogleClientId}});

        expect(envGoogleClientId()).toBe(mockGoogleClientId);
      });
    });

    it.skip('returns VITE_GOOGLE_CLIENT_ID from import.meta.env if process.env is undefined', () => {
      vi.stubGlobal('importMeta', {env: {VITE_GOOGLE_CLIENT_ID: mockGoogleClientId}});

      expect(envGoogleClientId()).toBe(mockGoogleClientId);
    });

    it('returns undefined if neither process.env nor import.meta.env are defined', () => {
      expect(envGoogleClientId()).toBeUndefined();
    });
  });
});
