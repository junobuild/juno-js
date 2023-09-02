import {Principal} from '@dfinity/principal';
import {assertNonNullish, isNullish, toNullable} from '@junobuild/utils';
import isbot from 'isbot';
import {nanoid} from 'nanoid';
import type {AnalyticKey, SetPageView, SetTrackEvent} from '../../declarations/orbiter/orbiter.did';
import {getOrbiterActor} from '../api/actor.api';
import {
  delPageViews,
  delTrackEvents,
  getPageViews,
  getTrackEvents,
  setPageView,
  setTrackEvent
} from '../services/idb.services';
import type {EnvironmentActor} from '../types/env';
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
    case 'junoStartTimer':
      await startTimer();
      return;
    case 'junoStopTimer':
      stopTimer();
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

let env: EnvironmentActor | undefined;

const init = async (environment: PostMessageInitAnalytics) => {
  const {orbiterId, satelliteId} = environment;

  assertNonNullish(orbiterId, ORBITER_ID_UNDEFINED_MSG);
  assertNonNullish(satelliteId, SATELLITE_ID_UNDEFINED_MSG);

  env = environment;
};

let timer: NodeJS.Timeout | undefined = undefined;

const stopTimer = () => {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
};

const sessionId = nanoid();

const startTimer = async () => {
  // Avoid re-starting the timer
  if (timer !== undefined) {
    return;
  }

  const execute = async () => await Promise.all([syncPageViews(), syncTrackEvents()]);

  // We starts now but also schedule the update after wards
  await execute();

  // TODO: 1000 should be a parameter
  timer = setInterval(execute, 1000);
};

let syncViewsInProgress = false;
let syncEventsInProgress = false;

const syncPageViews = async () => {
  if (isNullish(env) || env?.orbiterId === undefined || env?.satelliteId === undefined) {
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

  // TODO: handle errors
  const actor = await getOrbiterActor(env);

  await actor.set_page_views(
    entries.map(([key, entry]) => [{...ids(env!), key: key as string}, entry])
  );

  await delPageViews(entries.map(([key, _]) => key));

  syncViewsInProgress = false;
};

const syncTrackEvents = async () => {
  if (isNullish(env) || env?.orbiterId === undefined || env?.satelliteId === undefined) {
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

  // TODO: persist track events
  console.log({sessionId}, entries);

  await delTrackEvents(entries.map(([key, _]) => key));

  syncEventsInProgress = false;
};

const trackPageView = async (data: PostMessagePageView) => {
  if (isNullish(env) || env?.orbiterId === undefined || env?.satelliteId === undefined) {
    return;
  }

  if (isBot()) {
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

  await setPageView(pageView);
};

const trackPageEvent = async ({name, metadata}: PostMessageTrackEvent) => {
  if (isNullish(env) || env?.orbiterId === undefined || env?.satelliteId === undefined) {
    return;
  }

  if (isBot()) {
    return;
  }

  const trackEvent: SetTrackEvent = {
    name,
    metadata: isNullish(metadata) ? [] : [Object.entries(metadata ?? {})],
    ...timestamp()
  };

  await setTrackEvent(trackEvent);
};

const ids = (env: EnvironmentActor): Pick<AnalyticKey, 'session_id' | 'satellite_id'> => ({
  session_id: sessionId,
  satellite_id: Principal.fromText(env.satelliteId)
});

const timestamp = (): {collected_at: bigint; updated_at: [] | [bigint]} => ({
  collected_at: nowInBigIntNanoSeconds(),
  updated_at: []
});

const isBot = (): boolean => {
  const {userAgent} = navigator;

  if (userAgent !== undefined) {
    return isbot(userAgent);
  }

  return false;
};
