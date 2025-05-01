/**
 * @vitest-environment jsdom
 */

import {initOrbiter} from '../index';
import {PerformanceServices} from '../services/performance.services';
import {UserAgentServices} from '../services/user-agent.services';

vi.mock('../utils/window.env.utils', () => ({
  envSatelliteId: vi.fn(() => 'satellite-from-env'),
  envOrbiterId: vi.fn(() => 'orbiter-from-env'),
  envContainer: vi.fn(() => undefined)
}));

describe('initOrbiter', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ok: true})
      })
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize services properly and return cleanup', () => {
    const result = initOrbiter();

    expect(result).toBeTypeOf('function');
  });

  it('should set page view', async () => {
    const spy = vi.spyOn(global, 'fetch');

    initOrbiter();

    await vi.waitFor(() => expect(spy).toHaveBeenCalled());
  });

  it('should have called set page view with env', async () => {
    initOrbiter();

    await vi.waitFor(() => {
      const [[url, options]] = vi.mocked(fetch).mock.calls;

      expect(url).toBe('https://orbiter-from-env.icp0.io/views');
      expect(options).toMatchObject({
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const body = JSON.parse(options?.body as string);
      expect(body.satellite_id).toBe('satellite-from-env');
      expect(body.page_views).toBeDefined();
    });
  });

  it('should have called set page view with user env', async () => {
    initOrbiter({
      container: 'http://localhost:666',
      satelliteId: 'my-satellite-id',
      orbiterId: 'my-orbiter-id'
    });

    await vi.waitFor(() => {
      const [[url, options]] = vi.mocked(fetch).mock.calls;

      expect(url).toBe('http://my-orbiter-id.localhost:666/views');
      expect(options).toMatchObject({
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const body = JSON.parse(options?.body as string);
      expect(body.satellite_id).toBe('my-satellite-id');
      expect(body.page_views).toBeDefined();
    });
  });

  describe('performance', () => {
    it('should not start performance metrics', async () => {
      const spyStart = vi.spyOn(PerformanceServices.prototype, 'startPerformance');

      initOrbiter({
        options: {
          performance: false
        }
      });

      await vi.waitFor(() => expect(spyStart).not.toHaveBeenCalled());
    });

    it('should start performance metrics', async () => {
      const spyStart = vi.spyOn(PerformanceServices.prototype, 'startPerformance');

      initOrbiter({
        options: {
          performance: true
        }
      });

      await vi.waitFor(() => expect(spyStart).toHaveBeenCalled());
    });
  });

  describe('user-agent parser', () => {
    it('should not use ua parser by default', async () => {
      const spyParse = vi.spyOn(UserAgentServices.prototype, 'parseUserAgent');

      const spy = vi.spyOn(global, 'fetch');

      initOrbiter();

      await vi.waitFor(() => expect(spy).toHaveBeenCalled());

      expect(spyParse).not.toHaveBeenCalled();
    });

    it('should not use ua parser when set to false', async () => {
      const spyParse = vi.spyOn(UserAgentServices.prototype, 'parseUserAgent');

      const spy = vi.spyOn(global, 'fetch');

      initOrbiter({
        options: {
          userAgentParser: false
        }
      });

      await vi.waitFor(() => expect(spy).toHaveBeenCalled());

      expect(spyParse).not.toHaveBeenCalled();
    });

    it('should use user-agent parser when explicitly set to true', async () => {
      const spyParse = vi.spyOn(UserAgentServices.prototype, 'parseUserAgent');

      const spy = vi.spyOn(global, 'fetch');

      initOrbiter({
        options: {
          userAgentParser: true
        }
      });

      await vi.waitFor(() => expect(spy).toHaveBeenCalled());

      expect(spyParse).toHaveBeenCalled();
    });
  });
});
