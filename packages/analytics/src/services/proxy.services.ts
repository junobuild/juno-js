import {EnvironmentProxy} from '../types/env';
import {PageView, TrackEvent} from '../types/track';

const FunctionsProxyUrl = 'llaqvdlz6a-uc.a.run.app';
const pageViewProxyUrl = `https://pageview-${FunctionsProxyUrl}`;
const pageEventProxyUrl = `https://pageevent-${FunctionsProxyUrl}`;

export const setPageViewProxy = async ({proxyUrl, ...rest}: PageView & EnvironmentProxy) => {
  const response = await fetch(proxyUrl ?? pageViewProxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rest)
  });

  if (!response.ok) {
    throw new Error(`Post page view error.`);
  }
};

export const setPageEventProxy = async <T>({
  proxyUrl,
  ...rest
}: TrackEvent<T> & EnvironmentProxy) => {
  const response = await fetch(proxyUrl ?? pageEventProxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rest)
  });

  if (!response.ok) {
    throw new Error(`Post track event error.`);
  }
};