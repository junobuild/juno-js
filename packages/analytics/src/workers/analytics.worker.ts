import {assertNonNullish, isNullish} from '@junobuild/utils';
import {nanoid} from 'nanoid';
import {setPageEventProxy, setPageViewProxy} from '../services/proxy.services';
import type {EnvironmentProxy} from '../types/env';
import type {
  PostMessage,
  PostMessageInitAnalytics,
  PostMessagePageView,
  PostMessageTrackEvent
} from '../types/post-message';
import type {PageView} from '../types/track';

onmessage = async <D, T extends PostMessagePageView | PostMessageTrackEvent<T>>({
  data: dataMsg
}: MessageEvent<PostMessage<D, T>>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoInitEnvironment':
      await init(data as PostMessageInitAnalytics);
      return;
    case 'junoTrackPageView':
      await trackPageView(data as PostMessagePageView);
      return;
    case 'junoTrackEvent':
      await trackPageEvent(data as PostMessageTrackEvent<T>);
      return;
  }
};

const SATELLITE_ID_UNDEFINED_MSG =
  'Analytics worker not initialized. Did you set `satelliteId`?' as const;

const ORBITER_ID_UNDEFINED_MSG =
  'Analytics worker not initialized. Did you set `orbiterId`?' as const;

let env: EnvironmentProxy | undefined;

const init = async (environment: PostMessageInitAnalytics) => {
  const {orbiterId, satelliteId} = environment;

  assertNonNullish(orbiterId, ORBITER_ID_UNDEFINED_MSG);
  assertNonNullish(satelliteId, SATELLITE_ID_UNDEFINED_MSG);

  env = environment;
};

const sessionId = nanoid();

const now = (): number => Date.now();

const trackPageView = async (data: PostMessagePageView) => {
  if (isNullish(env)) {
    return;
  }

  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();
  const {userAgent} = navigator;

  const pageView: PageView = {
    sessionId,
    ...data,
    timeZone,
    userAgent,
    collectedAt: now()
  };

  await setPageViewProxy({
    ...pageView,
    ...env
  });
};

const trackPageEvent = async <T>(track: PostMessageTrackEvent<T>) => {
  if (isNullish(env)) {
    return;
  }

  await setPageEventProxy({
    sessionId,
    ...track,
    collectedAt: now(),
    ...env
  });
};
