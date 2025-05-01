import {envContainer, envOrbiterId, envSatelliteId} from '../../utils/window.env.utils';

describe('window.env.utils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {...originalEnv};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('envSatelliteId', () => {
    it('should read from process.env.NEXT_PUBLIC_SATELLITE_ID', () => {
      process.env.NEXT_PUBLIC_SATELLITE_ID = 'satellite-id-process';
      expect(envSatelliteId()).toBe('satellite-id-process');
    });
  });

  describe('envOrbiterId', () => {
    it('should read from process.env.NEXT_PUBLIC_ORBITER_ID', () => {
      process.env.NEXT_PUBLIC_ORBITER_ID = 'orbiter-id-process';
      expect(envOrbiterId()).toBe('orbiter-id-process');
    });
  });

  describe('envContainer', () => {
    it('should read from process.env.NEXT_PUBLIC_CONTAINER', () => {
      process.env.NEXT_PUBLIC_CONTAINER = 'container-process';
      expect(envContainer()).toBe('container-process');
    });
  });
});
