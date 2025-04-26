import {DOCKER_CONTAINER_WEB_URL} from '../constants/container.constants';
import type {
  SetPageViewsRequest,
  SetPerformanceMetricsRequest,
  SetTrackEventsRequest
} from '../types/api.payload';
import type {Environment} from '../types/env';
import {jsonReplacer} from '../utils/dfinity/json.utils';
import {nonNullish} from '../utils/dfinity/nullish.utils';

type ApiPath = '/views' | '/events' | '/metrics';

export class ApiError extends Error {
  constructor(
    private readonly status: number,
    private readonly statusText: string
  ) {
    super(`[${status}] Orbiter Error: ${statusText}`);
  }
}

export class OrbiterApi {
  readonly #apiUrl: string;

  constructor({container, orbiterId}: Environment) {
    const localActor = nonNullish(container) && container !== false;

    const hostDomain = localActor ? DOCKER_CONTAINER_WEB_URL : 'https://icp0.io';

    const {protocol, host} = new URL(hostDomain);

    this.#apiUrl = `${protocol}//${orbiterId}.${host}`;
  }

  postPageViews = async ({request: payload}: {request: SetPageViewsRequest}): Promise<null> =>
    await this.post<SetPageViewsRequest, null>({
      path: '/views',
      payload
    });

  postTrackEvents = async ({request: payload}: {request: SetTrackEventsRequest}): Promise<null> =>
    await this.post<SetTrackEventsRequest, null>({
      path: '/events',
      payload
    });

  postPerformanceMetrics = async ({
    request: payload
  }: {
    request: SetPerformanceMetricsRequest;
  }): Promise<null> =>
    await this.post<SetPerformanceMetricsRequest, null>({
      path: '/metrics',
      payload
    });

  post = async <T, R>({path, payload}: {path: ApiPath; payload: T}): Promise<R> => {
    const response = await fetch(`${this.#apiUrl}${path}`, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload, jsonReplacer)
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return await response.json();
  };
}
