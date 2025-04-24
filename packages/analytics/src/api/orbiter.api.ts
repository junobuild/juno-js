import {jsonReplacer, nonNullish} from '@dfinity/utils';
import {DOCKER_CONTAINER_WEB_URL} from '../constants/container.constants';
import type {
  SetPageViewRequest,
  SetPerformanceRequest,
  SetTrackEventRequest
} from '../types/api.payload';
import type {Environment} from '../types/env';

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

  postPageViews = async ({requests: payload}: {requests: SetPageViewRequest[]}): Promise<null> =>
    await this.post<SetPageViewRequest[], null>({
      path: '/views',
      payload
    });

  postTrackEvents = async ({
    requests: payload
  }: {
    requests: SetTrackEventRequest[];
  }): Promise<null> =>
    await this.post<SetTrackEventRequest[], null>({
      path: '/events',
      payload
    });

  postPerformanceMetrics = async ({
    requests: payload
  }: {
    requests: SetPerformanceRequest[];
  }): Promise<null> =>
    await this.post<SetPerformanceRequest[], null>({
      path: '/metrics',
      payload
    });

  post = async <T, R>({path, payload}: {path: ApiPath; payload: T}): Promise<R> => {
    const response = await fetch(`${this.#apiUrl}${path}`, {
      method: 'POST',
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
