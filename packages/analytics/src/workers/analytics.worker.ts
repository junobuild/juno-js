import {Principal} from '@dfinity/principal';
import {assertNonNullish, isNullish, toNullable} from '@junobuild/utils';
import {nanoid} from 'nanoid';
import type {AnalyticKey, SetPageView, SetTrackEvent} from '../../declarations/orbiter/orbiter.did';
import {setPageViewProxy, setTrackEventProxy} from '../services/proxy.services';
import type {EnvironmentProxy} from '../types/env';
import type {
  PostMessage,
  PostMessageInitAnalytics,
  PostMessagePageView,
  PostMessageTrackEvent
} from '../types/post-message';
import {nowInBigIntNanoSeconds} from '../utils/date.utils';

onmessage = async ({data: dataMsg}: MessageEvent<PostMessage>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoInitEnvironment':
      await init(data as PostMessageInitAnalytics);
      return;
    case 'junoTrackPageView':
      await trackPageView(data as PostMessagePageView);
      return;
    case 'junoTrackEvent':
      await trackPageEvent(data as PostMessageTrackEvent);
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

const trackPageView = async (data: PostMessagePageView) => {
  if (isNullish(env) || env?.orbiterId === undefined || env?.satelliteId === undefined) {
    return;
  }

  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();
  const {userAgent} = navigator;

  const pageView: SetPageView = {
    ...data,
    time_zone: timeZone,
    user_agent: toNullable(userAgent),
    ...timestamp()
  };

  await setPageViewProxy({
    key: key(env),
    pageView,
    ...env
  });
};

const trackPageEvent = async ({name, metadata}: PostMessageTrackEvent) => {
  if (isNullish(env) || env?.orbiterId === undefined || env?.satelliteId === undefined) {
    return;
  }

  const trackEvent: SetTrackEvent = {
    name,
    metadata: isNullish(metadata) ? [] : [Object.entries(metadata ?? {})],
    ...timestamp()
  };

  await setTrackEventProxy({
    key: key(env),
    trackEvent,
    ...env
  });
};

const key = (env: EnvironmentProxy): AnalyticKey => ({
  key: nanoid(),
  session_id: sessionId,
  satellite_id: Principal.fromText(env.satelliteId)
});

const timestamp = (): {collected_at: bigint; updated_at: [] | [bigint]} => ({
  collected_at: nowInBigIntNanoSeconds(),
  updated_at: []
});
