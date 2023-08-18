import {Principal} from '@dfinity/principal';
import {assertNonNullish, isNullish, toNullable} from '@junobuild/utils';
import {nanoid} from 'nanoid';
import type {SetPageView} from '../../declarations/orbiter/orbiter.did';
import {setPageEventProxy, setPageViewProxy} from '../services/proxy.services';
import type {EnvironmentProxy} from '../types/env';
import type {
  PostMessage,
  PostMessageInitAnalytics,
  PostMessagePageView,
  PostMessageTrackEvent
} from '../types/post-message';
import {nowInBigIntNanoSeconds} from '../utils/date.utils';

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
  if (isNullish(env) || env?.orbiterId === undefined || env?.satelliteId === undefined) {
    return;
  }

  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();
  const {userAgent} = navigator;

  const now = nowInBigIntNanoSeconds();

  const pageView: SetPageView = {
    ...data,
    time_zone: timeZone,
    user_agent: toNullable(userAgent),
    collected_at: now,
    updated_at: []
  };

  await setPageViewProxy({
    key: {
      key: nanoid(),
      session_id: sessionId,
      satellite_id: Principal.fromText(env.satelliteId)
    },
    pageView,
    ...env
  });
};

const trackPageEvent = async <T>(track: PostMessageTrackEvent<T>) => {
  if (isNullish(env) || env?.orbiterId === undefined || env?.satelliteId === undefined) {
    return;
  }

  await setPageEventProxy({
    sessionId,
    ...track,
    collectedAt: now(),
    ...env
  });
};
