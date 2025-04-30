/**
 * @vitest-environment jsdom
 */

import {type Mock, MockInstance} from 'vitest';
import {orbiterIdMock, satelliteIdMock} from '../mocks/orbiter.mock';
import {jsonReviver} from '../utils/dfinity/json.utils';
import * as analyticServices from './analytics.services';
import {startPerformance} from './performance.services';

vi.mock('web-vitals', () => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onINP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn()
}));

vi.mock('../utils/env.utils', () => ({
  isBrowser: vi.fn(() => true)
}));

vi.mock('./performance.services', () => ({
  startPerformance: vi.fn()
}));

vi.mock('../src/constants/container.constants', () => ({
  DOCKER_CONTAINER_WEB_URL: 'http://localhost:5973'
}));

describe('analytics.services', () => {
  let spy: MockInstance;

  const env = {orbiterId: orbiterIdMock, satelliteId: satelliteIdMock, container: false};

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());

    spy = (fetch as unknown as Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ok: true}), {status: 200})
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initOrbiterServices', () => {
    it('should initialize orbiter services', () => {
      const {cleanup} = analyticServices.initOrbiterServices(env);
      expect(typeof cleanup).toBe('function');
      cleanup();
    });
  });

  describe('trackers', () => {
    beforeEach(() => {
      analyticServices.initOrbiterServices(env);
    });

    describe('trackPageView', () => {
      it('should fire trackPageView', async () => {
        analyticServices.trackPageView();

        await vi.waitFor(() => expect(spy).toHaveBeenCalled());
      });

      it('should fire trackPageViewAsync', async () => {
        await expect(analyticServices.trackPageViewAsync()).resolves.toBeUndefined();
        expect(fetch).toHaveBeenCalled();
      });
    });

    describe('trackEvent', () => {
      const data = {name: 'test'};

      it('should fire trackPageView', async () => {
        analyticServices.trackEvent(data);

        await vi.waitFor(() => expect(spy).toHaveBeenCalled());
      });

      it('should fire trackPageViewAsync', async () => {
        await expect(analyticServices.trackEventAsync(data)).resolves.toBeUndefined();
        expect(fetch).toHaveBeenCalled();
      });
    });
  });

  describe('setPageView', () => {
    beforeEach(() => {
      analyticServices.initOrbiterServices(env);
    });

    it('should call setPageView correctly', async () => {
      await analyticServices.setPageView();
      expect(fetch).toHaveBeenCalled();
    });

    it('should call setPageView with expected sizes', async () => {
      Object.defineProperty(window, 'screen', {
        value: {
          width: 1920,
          height: 1080,
          availWidth: 1920,
          availHeight: 1040,
          colorDepth: 24,
          pixelDepth: 24
        },
        writable: true
      });

      await analyticServices.setPageView();
      const [[url, options]] = (fetch as Mock).mock.calls;
      const body = JSON.parse(options.body, jsonReviver);

      const {page_view} = body.page_views[0];

      expect(page_view.device.inner_width).toEqual(1024);
      expect(page_view.device.inner_height).toEqual(768);
      expect(page_view.device.screen_width).toEqual(1920);
      expect(page_view.device.screen_height).toEqual(1040);
    });

    it('should include parsed client info in page view', async () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
        configurable: true
      });

      await analyticServices.setPageView();
      const [[url, options]] = (fetch as Mock).mock.calls;
      const body = JSON.parse(options.body, jsonReviver);

      expect(url).toMatch(/\/views$/);
      expect(body.page_views[0].page_view.client).toEqual({
        browser: 'Mobile Safari',
        os: 'iOS',
        device: 'mobile'
      });
    });
  });

  describe('initTrackPerformance', () => {
    beforeEach(() => {
      analyticServices.initOrbiterServices(env);
    });

    it('should call startPerformance if enabled', async () => {
      await analyticServices.initTrackPerformance({options: {}, ...env});
      expect(startPerformance).toHaveBeenCalled();
    });

    it('should not call startPerformance if disabled', async () => {
      await analyticServices.initTrackPerformance({options: {performance: false}, ...env});
      expect(startPerformance).not.toHaveBeenCalled();
    });
  });

  describe('initTrackPageViews', () => {
    it('should proxy pushState and listen to popstate', () => {
      const addSpy = vi.spyOn(window, 'addEventListener');
      const {cleanup} = analyticServices.initTrackPageViews();
      expect(addSpy).toHaveBeenCalledWith('popstate', expect.any(Function), {passive: true});
      cleanup();
    });
  });
});
