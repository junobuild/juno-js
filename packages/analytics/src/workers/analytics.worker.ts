import {isbot} from 'isbot';
import {ApiError, OrbiterApi} from '../api/orbiter.api';
import {
  delPageViews,
  delPerformanceMetrics,
  delTrackEvents,
  getPageViews,
  getPerformanceMetrics,
  getTrackEvents
} from '../services/idb.services';
import {
  type SatelliteIdText,
  type SetPageViewsRequest,
  type SetPageViewsRequestEntry,
  type SetPerformanceMetricRequestEntry,
  type SetPerformanceMetricsRequest,
  type SetTrackEventRequestEntry,
  type SetTrackEventsRequest
} from '../types/api.payload';
import type {Environment, EnvironmentActor} from '../types/env';
import type {IdbKey} from '../types/idb';
import type {PostMessage, PostMessageInitEnvData} from '../types/post-message';
import {assertNonNullish} from '../utils/dfinity/asserts.utils';
import {debounce} from '../utils/dfinity/debounce.utils';
import {isNullish, nonNullish} from '../utils/dfinity/nullish.utils';

onmessage = async ({data: dataMsg}: MessageEvent<PostMessage>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoInitEnvironment':
      init(data as PostMessageInitEnvData);
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

const SATELLITE_ID_UNDEFINED_MSG = 'Analytics worker not initialized. Did you set `satelliteId`?';

const ORBITER_ID_UNDEFINED_MSG = 'Analytics worker not initialized. Did you set `orbiterId`?';

let env: Environment | undefined;
let api: OrbiterApi | undefined;

const init = (environment: PostMessageInitEnvData) => {
  const {orbiterId, satelliteId} = environment;

  assertNonNullish(orbiterId, ORBITER_ID_UNDEFINED_MSG);
  assertNonNullish(satelliteId, SATELLITE_ID_UNDEFINED_MSG);

  env = environment;

  api = new OrbiterApi(environment);
};

let timer: NodeJS.Timeout | undefined = undefined;

const sync = async () =>
  await Promise.all([syncPageViews(), syncTrackEvents(), syncPerformanceMetrics()]);

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
let syncMetricsInProgress = false;

const syncPageViews = async () => {
  if (!isEnvInitialized(env)) {
    return;
  }

  if (isApiNotInitialized(api)) {
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
    const request: SetPageViewsRequest = {
      ...satelliteId(env as EnvironmentActor),
      page_views: entries.map<SetPageViewsRequestEntry>(([key, {collected_at, ...page_view}]) => ({
        key: {key: key as IdbKey, collected_at},
        page_view
      }))
    };

    await api.postPageViews({request});

    await delPageViews(entries.map(([key, _]) => key));
  } catch (err: unknown) {
    onError(err);
  }

  syncViewsInProgress = false;
};

const debounceSyncPageViews = debounce(async () => await syncPageViews(), 100);

const syncTrackEvents = async () => {
  if (!isEnvInitialized(env)) {
    return;
  }

  if (isApiNotInitialized(api)) {
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
    const request: SetTrackEventsRequest = {
      ...satelliteId(env as EnvironmentActor),
      track_events: entries.map<SetTrackEventRequestEntry>(
        ([key, {collected_at, ...track_event}]) => ({
          key: {key: key as IdbKey, collected_at},
          track_event
        })
      )
    };

    await api.postTrackEvents({request});

    await delTrackEvents(entries.map(([key, _]) => key));
  } catch (err: unknown) {
    onError(err);
  }

  syncEventsInProgress = false;
};

const debounceSyncTrackEvents = debounce(async () => await syncTrackEvents(), 250);

const syncPerformanceMetrics = async () => {
  if (!isEnvInitialized(env)) {
    return;
  }

  if (env?.options?.performance === false) {
    return;
  }

  if (isApiNotInitialized(api)) {
    return;
  }

  // One batch at a time to avoid to process multiple times the same entries
  if (syncMetricsInProgress) {
    return;
  }

  const entries = await getPerformanceMetrics();

  if (isNullish(entries) || entries.length === 0) {
    // Nothing to do
    return;
  }

  syncMetricsInProgress = true;

  try {
    const request: SetPerformanceMetricsRequest = {
      ...satelliteId(env as EnvironmentActor),
      performance_metrics: entries.map<SetPerformanceMetricRequestEntry>(
        ([key, {collected_at, ...performance_metric}]) => ({
          key: {key: key as IdbKey, collected_at},
          performance_metric
        })
      )
    };

    await api.postPerformanceMetrics({request});

    await delPerformanceMetrics(entries.map(([key, _]) => key));
  } catch (err: unknown) {
    onError(err);
  }

  syncMetricsInProgress = false;
};

// Track

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

// Utilities

const satelliteId = (env: EnvironmentActor): {satellite_id: SatelliteIdText} => ({
  satellite_id: env.satelliteId
});

const isBot = (): boolean => {
  const {userAgent} = navigator;

  if (nonNullish(userAgent)) {
    return isbot(userAgent);
  }

  return false;
};

const isEnvInitialized = (
  // eslint-disable-next-line local-rules/use-option-type-wrapper
  env: EnvironmentActor | undefined | null
): env is NonNullable<EnvironmentActor> =>
  env !== undefined && env !== null && nonNullish(env.orbiterId) && nonNullish(env.satelliteId);

const isApiNotInitialized = (api: OrbiterApi | undefined): api is undefined => isNullish(api);

const onError = (err: unknown) => {
  if (err instanceof ApiError) {
    console.warn(err.message);
    return;
  }

  // The canister does not trap so, if we land here there was a network issue or so.
  // So we keep the entries to try to transmit those next time.
  console.error(err);
};
