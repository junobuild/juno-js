import type {Mock} from 'vitest';
import {
  okResponseMock,
  pageViewsRequestsMock,
  performanceMetricsRequestMock,
  trackEventsRequestMock
} from '../mocks/orbiter.mock';
import {Environment} from '../types/env';
import {jsonReplacer} from '../utils/dfinity/json.utils';
import {ApiError, OrbiterApi} from './orbiter.api';
import {DOCKER_CONTAINER_WEB_URL} from '../constants/container.constants';

vi.mock('../src/constants/container.constants', () => ({
  DOCKER_CONTAINER_WEB_URL: 'http://localhost:5973'
}));

describe('OrbiterApi', () => {
  const orbiterId = 'ot5tb-nqaaa-aaaal-ac2sa-cai';
  let api: OrbiterApi;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe.each([
    {container: false, apiUrl: `https://${orbiterId}.icp0.io`},
    {apiUrl: `https://${orbiterId}.icp0.io`},
    {container: true, apiUrl: DOCKER_CONTAINER_WEB_URL},
    {container: 'http://test.com', apiUrl: 'http://test.com'}
  ])('API with container', ({container, apiUrl}) => {
    beforeEach(() => {
      api = new OrbiterApi({container, orbiterId} as Environment);
    });

    describe('Communication', () => {
      it('should post page views correctly', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(JSON.stringify(okResponseMock), {status: 200})
        );

        await api.postPageViews({
          request: pageViewsRequestsMock
        });

        expect(fetch).toHaveBeenCalledWith(`${apiUrl}/views`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pageViewsRequestsMock, jsonReplacer)
        });
      });

      it('should post track events correctly', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(JSON.stringify(okResponseMock), {status: 200})
        );

        await api.postTrackEvents({
          request: trackEventsRequestMock
        });

        expect(fetch).toHaveBeenCalledWith(`${apiUrl}/events`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(trackEventsRequestMock, jsonReplacer)
        });
      });

      it('should post performance metrics correctly', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(JSON.stringify(okResponseMock), {status: 200})
        );

        await api.postPerformanceMetrics({
          request: performanceMetricsRequestMock
        });

        expect(fetch).toHaveBeenCalledWith(`${apiUrl}/metrics`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(performanceMetricsRequestMock, jsonReplacer)
        });
      });

      it('should throw ApiError when postPageViews fails', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(null, {status: 500, statusText: 'Internal Server Error'})
        );

        await expect(api.postPageViews({request: pageViewsRequestsMock})).rejects.toThrow(ApiError);
      });

      it('should throw ApiError when postTrackEvents fails', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(null, {status: 500, statusText: 'Internal Server Error'})
        );

        await expect(api.postTrackEvents({request: trackEventsRequestMock})).rejects.toThrow(
          ApiError
        );
      });

      it('should throw ApiError when postPerformanceMetrics fails', async () => {
        (fetch as unknown as Mock).mockResolvedValueOnce(
          new Response(null, {status: 500, statusText: 'Internal Server Error'})
        );

        await expect(
          api.postPerformanceMetrics({request: performanceMetricsRequestMock})
        ).rejects.toThrow(ApiError);
      });
    });
  });
});
