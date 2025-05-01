import type {Mock} from 'vitest';
import {ApiError} from '../../api/orbiter.api';
import {OrbiterServices} from '../../services/orbiter.services';
import {Environment} from '../../types/env';
import {jsonReplacer} from '../../utils/dfinity/json.utils';
import {
  okResponseMock,
  orbiterIdMock,
  pageViewsRequestsMock,
  performanceMetricsRequestMock,
  satelliteIdMock,
  trackEventsRequestMock
} from '../mocks/orbiter.mock';

vi.mock('../src/constants/container.constants', () => ({
  DOCKER_CONTAINER_WEB_URL: 'http://localhost:5973'
}));

describe('orbiter.services', () => {
  let services: OrbiterServices;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe.each([
    {container: false, apiUrl: `https://${orbiterIdMock}.icp0.io`},
    {apiUrl: `https://${orbiterIdMock}.icp0.io`},
    {container: true, apiUrl: `http://${orbiterIdMock}.localhost:5987`},
    {container: 'http://localhost:6666', apiUrl: `http://${orbiterIdMock}.localhost:6666`}
  ])('OrbiterApi with container=%p', ({container, apiUrl}) => {
    beforeEach(() => {
      services = new OrbiterServices({
        container,
        orbiterId: orbiterIdMock,
        satelliteId: satelliteIdMock
      } as Environment);
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
              satellite_id: satelliteIdMock,
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
              satellite_id: satelliteIdMock,
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
              satellite_id: satelliteIdMock,
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
