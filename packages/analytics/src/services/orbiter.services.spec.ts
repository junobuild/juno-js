import type {Mock} from 'vitest';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {ApiError} from '../api/orbiter.api';
import {
  okResponseMock,
  pageViewsRequestsMock,
  performanceMetricsRequestMock,
  trackEventsRequestMock
} from '../mocks/orbiter.mock';
import {Environment} from '../types/env';
import {jsonReplacer} from '../utils/dfinity/json.utils';
import {OrbiterServices} from './orbiter.services';

vi.mock('../src/constants/container.constants', () => ({
  DOCKER_CONTAINER_WEB_URL: 'http://localhost:5973'
}));

describe('OrbiterServices', () => {
  const orbiterId = 'ot5tb-nqaaa-aaaal-ac2sa-cai';
  const satelliteId = 'satellite-xxx';
  let services: OrbiterServices;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe.each([
    {container: false, apiUrl: `https://${orbiterId}.icp0.io`},
    {apiUrl: `https://${orbiterId}.icp0.io`},
    {container: true, apiUrl: `http://${orbiterId}.localhost:5987`},
    {container: 'http://localhost:6666', apiUrl: `http://${orbiterId}.localhost:6666`}
  ])('OrbiterApi with container=%p', ({container, apiUrl}) => {
    beforeEach(() => {
      services = new OrbiterServices({container, orbiterId, satelliteId} as Environment);
    });

    describe('Success', () => {
      it('should set a page view correctly', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(JSON.stringify(okResponseMock, jsonReplacer), {status: 200})
        );

        const entry = pageViewsRequestsMock.page_views[0];

        await services.setPageView(entry);

        expect(fetch).toHaveBeenCalledWith(`${apiUrl}/views`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {
              satellite_id: satelliteId,
              page_views: [entry]
            },
            jsonReplacer
          )
        });
      });

      it('should set a track event correctly', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(JSON.stringify(okResponseMock, jsonReplacer), {status: 200})
        );

        const entry = trackEventsRequestMock.track_events[0];

        await services.setTrackEvent(entry);

        expect(fetch).toHaveBeenCalledWith(`${apiUrl}/events`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {
              satellite_id: satelliteId,
              track_events: [entry]
            },
            jsonReplacer
          )
        });
      });

      it('should set a performance metric correctly', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(JSON.stringify(okResponseMock, jsonReplacer), {status: 200})
        );

        const entry = performanceMetricsRequestMock.performance_metrics[0];

        await services.setPerformanceMetric(entry);

        expect(fetch).toHaveBeenCalledWith(`${apiUrl}/metrics`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {
              satellite_id: satelliteId,
              performance_metrics: [entry]
            },
            jsonReplacer
          )
        });
      });
    });

    describe('Errors', () => {
      it('should bubble ApiError from setPageView', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(null, {status: 500, statusText: 'Internal Server Error'})
        );

        const entry = pageViewsRequestsMock.page_views[0];

        await expect(services.setPageView(entry)).rejects.toThrow(ApiError);
      });

      it('should bubble ApiError from setTrackEvent', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(null, {status: 500, statusText: 'Internal Server Error'})
        );

        const entry = trackEventsRequestMock.track_events[0];

        await expect(services.setTrackEvent(entry)).rejects.toThrow(ApiError);
      });

      it('should bubble ApiError from setPerformanceMetric', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(null, {status: 500, statusText: 'Internal Server Error'})
        );

        const entry = performanceMetricsRequestMock.performance_metrics[0];

        await expect(services.setPerformanceMetric(entry)).rejects.toThrow(ApiError);
      });
    });
  });
});
