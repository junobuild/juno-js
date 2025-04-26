/**
 * @vitest-environment jsdom
 */

import {type Mock, MockInstance} from 'vitest';
import {initOrbiter} from './index';
import * as performanceServices from './services/performance.services';

vi.mock('./utils/window.env.utils', () => ({
  envSatelliteId: vi.fn(() => 'satellite-from-env'),
  envOrbiterId: vi.fn(() => 'orbiter-from-env'),
  envContainer: vi.fn(() => undefined)
}));

describe('initOrbiter', () => {
  let spy: MockInstance;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());

    spy = (fetch as unknown as Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ok: true}), {status: 200})
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize services properly and return cleanup', () => {
    const result = initOrbiter();

    expect(result).toBeTypeOf('function');
  });

  it('should set page view', async () => {
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

  it('should not start performance metrics', async () => {
    const spyStart = vi.spyOn(performanceServices, 'startPerformance');

    initOrbiter({
      options: {
        performance: false
      }
    });

    await vi.waitFor(() => expect(spyStart).not.toHaveBeenCalled());
  });

  it('should start performance metrics', async () => {
    const spyStart = vi.spyOn(performanceServices, 'startPerformance');

    initOrbiter({
      options: {
        performance: true
      }
    });

    await vi.waitFor(() => expect(spyStart).toHaveBeenCalled());
  });
});
