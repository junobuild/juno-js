import {jsonReplacer, nonNullish} from '@dfinity/utils';
import {DOCKER_CONTAINER_URL} from '../constants/container.constants';
import type {
  SetPageViewRequest,
  SetPerformanceRequest,
  SetTrackEventRequest
} from '../types/api.payload';
import type {ApiResponse} from '../types/api.response';
import type {Environment} from '../types/env';

type ApiPath = '/views' | '/events' | '/metrics';

export class ApiError extends Error {}

export class OrbiterApi {
  #apiUrl: string;

  constructor({container, satelliteId}: Environment) {
    const localActor = nonNullish(container) && container !== false;

    const hostDomain = localActor
      ? container === true
        ? DOCKER_CONTAINER_URL
        : container
      : 'https://icp0.io';

    const {protocol, host} = new URL(hostDomain);

    this.#apiUrl = `${protocol}://${satelliteId}.${host}`;
  }

  postPageViews = async ({
    requests: payload
  }: {
    requests: SetPageViewRequest[];
  }): Promise<ApiResponse<null>> =>
    await this.post<SetPageViewRequest[], null>({
      path: '/views',
      payload
    });

  postTrackEvents = async ({
    requests: payload
  }: {
    requests: SetTrackEventRequest[];
  }): Promise<ApiResponse<null>> =>
    await this.post<SetTrackEventRequest[], null>({
      path: '/events',
      payload
    });

  postPerformanceMetrics = async ({
    requests: payload
  }: {
    requests: SetPerformanceRequest[];
  }): Promise<ApiResponse<null>> =>
    await this.post<SetPerformanceRequest[], null>({
      path: '/metrics',
      payload
    });

  post = async <T, R>({path, payload}: {path: ApiPath; payload: T}): Promise<ApiResponse<R>> => {
    const response = await fetch(`${this.#apiUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload, jsonReplacer)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new ApiError(text);
    }

    return await response.json();
  };
}
