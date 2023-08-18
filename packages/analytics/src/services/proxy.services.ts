import type {EnvironmentProxy} from '../types/env';
import {PageViewProxy, TrackEventProxy} from '../types/proxy';
import {jsonReplacer} from '../utils/json.utils';

const JUNO_FUNCTION_PROXY_URL = 'llaqvdlz6a-uc.a.run.app';
const JUNO_PAGE_VIEW_PROXY_URL = `https://pageview-${JUNO_FUNCTION_PROXY_URL}`;
const JUNO_TRACK_EVENT_PROXY_URL = `https://trackevent-${JUNO_FUNCTION_PROXY_URL}`;

export const setPageViewProxy = async ({
  pageViewProxyUrl,
  ...rest
}: PageViewProxy & Pick<EnvironmentProxy, 'pageViewProxyUrl'>) => {
  const response = await fetch(pageViewProxyUrl ?? JUNO_PAGE_VIEW_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({...rest}, jsonReplacer)
  });

  if (!response.ok) {
    throw new Error(`Post page view error.`);
  }
};

export const setTrackEventProxy = async ({
  trackEventProxyUrl,
  ...rest
}: TrackEventProxy & Pick<EnvironmentProxy, 'trackEventProxyUrl'>) => {
  const response = await fetch(trackEventProxyUrl ?? JUNO_TRACK_EVENT_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({...rest}, jsonReplacer)
  });

  if (!response.ok) {
    throw new Error(`Post track event error.`);
  }
};
