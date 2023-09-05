import {Principal} from '@dfinity/principal';
import {assertNonNullish, debounce, isNullish, nonNullish} from '@junobuild/utils';
import isbot from 'isbot';
import type {AnalyticKey, Result_1, SetTrackEvent} from '../../declarations/orbiter/orbiter.did';
import {getOrbiterActor} from '../api/actor.api';
import {delPageViews, delTrackEvents, getPageViews, getTrackEvents} from '../services/idb.services';
import type {Environment, EnvironmentActor} from '../types/env';
import type {IdbKey, IdbTrackEvent} from '../types/idb';
import type {PostMessage, PostMessageInitEnvData} from '../types/post-message';

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
    case 'junoStopTracker':
      await destroy();
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

const destroy = async () => {
  // In case there is something left to sync
  await sync();

  if (nonNullish(timer)) {
    clearInterval(timer);
    timer = undefined;
  }

  self.close();
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

    const results = await actor.set_page_views(
      entries.map(([key, entry]) => [
        ids({env: env as EnvironmentActor, key: key as IdbKey}),
        entry
      ])
    );

    await delPageViews(entries.map(([key, _]) => key));

    consoleWarn(results);
  } catch (err: unknown) {
    // The canister does not trap so, if we land here there was a network issue or so.
    // So we keep the entries to try to transmit those next time.
    console.error(err);
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

    const toTrackEvent = ({metadata, ...rest}: IdbTrackEvent): SetTrackEvent => ({
      metadata: isNullish(metadata) ? [] : [Object.entries(metadata ?? {})],
      ...rest
    });

    const results = await actor.set_track_events(
      entries.map(([key, entry]) => [
        ids({env: env as EnvironmentActor, key: key as IdbKey}),
        toTrackEvent(entry)
      ])
    );

    await delTrackEvents(entries.map(([key, _]) => key));

    consoleWarn(results);
  } catch (err: unknown) {
    // The canister does not trap so, if we land here there was a network issue or so.
    // So we keep the entries to try to transmit those next time.
    console.error(err);
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

const ids = ({
  env: {satelliteId},
  key: [key, session_id]
}: {
  env: EnvironmentActor;
  key: IdbKey;
}): AnalyticKey => ({
  key,
  session_id,
  satellite_id: Principal.fromText(satelliteId)
});

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

const consoleWarn = (results: Result_1) => {
  if ('Ok' in results) {
    return;
  }

  results.Err.forEach(([key, error]) => console.warn(`${error} [Key: ${key.key}]`));
};
