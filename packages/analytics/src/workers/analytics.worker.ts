import { Principal } from '@dfinity/principal';
import { assertNonNullish,isNullish,nonNullish,toNullable } from '@junobuild/utils';
import { debounce } from '@junobuild/utils/src';
import isbot from 'isbot';
import { nanoid } from 'nanoid';
import type { AnalyticKey,SetPageView,SetTrackEvent } from '../../declarations/orbiter/orbiter.did';
import { getOrbiterActor } from '../api/actor.api';
import {
delPageViews,
delTrackEvents,
getPageViews,
getTrackEvents,
setPageView,
setTrackEvent
} from '../services/idb.services';
import type { EnvironmentActor } from '../types/env';
import type {
PostMessage,
PostMessageInitAnalytics,
PostMessagePageView,
PostMessageTrackEvent
} from '../types/post-message';
import { nowInBigIntNanoSeconds } from '../utils/date.utils';

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
    case 'junoSyncTrackEvents':
      await syncTrackEvents();
      return;
  }
};

const SATELLITE_ID_UNDEFINED_MSG =
  'Analytics worker not initialized. Did you set `satelliteId`?' as const;

const ORBITER_ID_UNDEFINED_MSG =
  'Analytics worker not initialized. Did you set `orbiterId`?' as const;

let env: EnvironmentActor | undefined;

const init = async (environment: PostMessageInitAnalytics) => {
  const {orbiterId, satelliteId} = environment;

  assertNonNullish(orbiterId, ORBITER_ID_UNDEFINED_MSG);
  assertNonNullish(satelliteId, SATELLITE_ID_UNDEFINED_MSG);

  env = environment;
};

const sessionId = nanoid();

let syncViewsInProgress = false;
let syncEventsInProgress = false;

const syncPageViews = async () => {
  if (!isEnvInitialized(env)) {
    return;
  }

  // One batch at a time to avoid to process multiple times the same entries
  if (syncViewsInProgress) {
    return;
  }

  const entries = await getPageViews();

  if (isNullish(entries) || entries.length === 0) {
    // Nothing to do
    return;
  }

  syncViewsInProgress = true;

  try {
    const actor = await getOrbiterActor(env);

    await actor.set_page_views(
      entries.map(([key, entry]) => [{...ids(env as EnvironmentActor), key: key as string}, entry])
    );

    await delPageViews(entries.map(([key, _]) => key));
  } catch (err: unknown) {
    // The canister does not trap so, if we land here there was a network issue or so.
    // So we keep the entries to try to transmit those next time.
  }

  syncViewsInProgress = false;
};

const debounceSyncPageViews = debounce(async () => syncPageViews(), 100);

const syncTrackEvents = async () => {
  if (!isEnvInitialized(env)) {
    return;
  }

  // One batch at a time to avoid to process multiple times the same entries
  if (syncEventsInProgress) {
    return;
  }

  const entries = await getTrackEvents();

  if (isNullish(entries) || entries.length === 0) {
    // Nothing to do
    return;
  }

  syncEventsInProgress = true;

  try {
    const actor = await getOrbiterActor(env);

    await actor.set_track_events(
      entries.map(([key, entry]) => [{...ids(env as EnvironmentActor), key: key as string}, entry])
    );

    await delTrackEvents(entries.map(([key, _]) => key));
  } catch (err: unknown) {
    // The canister does not trap so, if we land here there was a network issue or so.
    // So we keep the entries to try to transmit those next time.
  }

  syncEventsInProgress = false;
};

const debounceSyncTrackEvents = debounce(async () => await syncTrackEvents(), 250);

const trackPageView = async ({debounce, ...rest}: PostMessagePageView) => {
  if (!isEnvInitialized(env)) {
    return;
  }

  if (isBot()) {
    return;
  }

  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();

  const pageView: SetPageView = {
    ...rest,
    time_zone: timeZone,
    ...userAgent(),
    ...timestamp()
  };

  await setPageView(pageView);

  if (debounce) {
    debounceSyncPageViews();
    return;
  }

  await syncPageViews();
};

const trackPageEvent = async ({name, metadata}: PostMessageTrackEvent) => {
  if (!isEnvInitialized(env)) {
    return;
  }

  if (isBot()) {
    return;
  }

  const trackEvent: SetTrackEvent = {
    name,
    metadata: isNullish(metadata) ? [] : [Object.entries(metadata ?? {})],
    ...userAgent(),
    ...timestamp()
  };

  await setTrackEvent(trackEvent);

  debounceSyncTrackEvents();
};

const ids = (env: EnvironmentActor): Pick<AnalyticKey, 'session_id' | 'satellite_id'> => ({
  session_id: sessionId,
  satellite_id: Principal.fromText(env.satelliteId)
});

const timestamp = (): {collected_at: bigint; updated_at: [] | [bigint]} => ({
  collected_at: nowInBigIntNanoSeconds(),
  updated_at: []
});

const userAgent = (): {user_agent: [] | [string]} => {
  const {userAgent} = navigator;
  return {user_agent: toNullable(userAgent)};
};

const isBot = (): boolean => {
  const {userAgent} = navigator;

  if (nonNullish(userAgent)) {
    return isbot(userAgent);
  }

  return false;
};

const isEnvInitialized = (
  env: EnvironmentActor | undefined | null
): env is NonNullable<EnvironmentActor> =>
  env !== undefined && env !== null && nonNullish(env.orbiterId) && nonNullish(env.satelliteId);
