import {EnvironmentProxy} from '../types/env';
import {PageView, TrackEvent} from '../types/track';

export const setPageViewProxy = async ({proxyUrl, ...rest}: PageView & EnvironmentProxy) => {
  const response = await fetch(`https://pageview-llaqvdlz6a-uc.a.run.app`, {
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
  const response = await fetch(`https://pageevent-llaqvdlz6a-uc.a.run.app`, {
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
