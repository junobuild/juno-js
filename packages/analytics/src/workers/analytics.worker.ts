import {Principal} from '@dfinity/principal';
import {assertNonNullish, debounce, isNullish, nonNullish, toNullable} from '@junobuild/utils';
import isbot from 'isbot';
import {nanoid} from 'nanoid';
import type {AnalyticKey, SetPageView, SetTrackEvent} from '../../declarations/orbiter/orbiter.did';
import {getOrbiterActor} from '../api/actor.api';
import {delPageViews, delTrackEvents, getPageViews, getTrackEvents} from '../services/idb.services';
import type {Environment, EnvironmentActor} from '../types/env';
import type {IdbPageView, IdbTrackEvent} from '../types/idb';
import type {PostMessage, PostMessageInitEnvData} from '../types/post-message';
import {nowInBigIntNanoSeconds} from '../utils/date.utils';

onmessage = async ({data: dataMsg}: MessageEvent<PostMessage>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoInitEnvironment':
      await init(data as PostMessageInitEnvData);
      return;
    case 'junoTrackPageView':
      trackPageView();
      return;
    case 'junoTrackEvent':
      trackPageEvent();
      return;
    case 'junoStartTrackTimer':
      await startTimer();
      return;
    case 'junoStopTrackTimer':
      await stopTimer();
      return;
  }
};

const SATELLITE_ID_UNDEFINED_MSG =
  'Analytics worker not initialized. Did you set `satelliteId`?' as const;

const ORBITER_ID_UNDEFINED_MSG =
  'Analytics worker not initialized. Did you set `orbiterId`?' as const;

let env: Environment | undefined;

const init = async (environment: PostMessageInitEnvData) => {
  const {orbiterId, satelliteId} = environment;

  assertNonNullish(orbiterId, ORBITER_ID_UNDEFINED_MSG);
  assertNonNullish(satelliteId, SATELLITE_ID_UNDEFINED_MSG);

  env = environment;
};

let timer: NodeJS.Timeout | undefined = undefined;

const sync = async () => await Promise.all([syncPageViews(), syncTrackEvents()]);

const stopTimer = async () => {
  if (isNullish(timer)) {
    return;
  }

  // In case there is something left to sync
  await sync();

  clearInterval(timer);
  timer = undefined;
};

const startTimer = async () => {
  // Avoid re-starting the timer
  if (nonNullish(timer)) {
    return;
  }

  // We starts now but also schedule the update after wards
  await sync();

  timer = setInterval(sync, env?.worker?.timerInterval ?? 1000);
};

const sessionId = nanoid();

// We use a timer in addition to debouncing the tracked pages and events. This means that if some data is not synchronized with the backend because a job is already in progress, the timer will trigger data syncing on the next click of the clock.
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

    const toSetPageView = (pageView: IdbPageView): SetPageView => {
      const {timeZone} = Intl.DateTimeFormat().resolvedOptions();

      return {
        ...pageView,
        time_zone: timeZone,
        ...userAgent(),
        ...timestamp()
      };
    };

    await actor.set_page_views(
      entries.map(([key, entry]) => [
        {...ids(env as EnvironmentActor), key: key as string},
        toSetPageView(entry)
      ])
    );

    await delPageViews(entries.map(([key, _]) => key));
  } catch (err: unknown) {
    // The canister does not trap so, if we land here there was a network issue or so.
    // So we keep the entries to try to transmit those next time.
  }

  syncViewsInProgress = false;
};

const debounceSyncPageViews = debounce(async () => await syncPageViews(), 100);

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

    const toTrackEvent = ({name, metadata}: IdbTrackEvent): SetTrackEvent => ({
      name,
      metadata: isNullish(metadata) ? [] : [Object.entries(metadata ?? {})],
      ...userAgent(),
      ...timestamp()
    });

    await actor.set_track_events(
      entries.map(([key, entry]) => [
        {...ids(env as EnvironmentActor), key: key as string},
        toTrackEvent(entry)
      ])
    );

    await delTrackEvents(entries.map(([key, _]) => key));
  } catch (err: unknown) {
    // The canister does not trap so, if we land here there was a network issue or so.
    // So we keep the entries to try to transmit those next time.
  }

  syncEventsInProgress = false;
};

const debounceSyncTrackEvents = debounce(async () => await syncTrackEvents(), 250);

const trackPageView = () => {
  if (!isEnvInitialized(env)) {
    return;
  }

  if (isBot()) {
    return;
  }

  debounceSyncPageViews();
};

const trackPageEvent = () => {
  if (!isEnvInitialized(env)) {
    return;
  }

  if (isBot()) {
    return;
  }

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
