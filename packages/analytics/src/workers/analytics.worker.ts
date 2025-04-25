import {assertNonNullish, debounce, fromNullable, isNullish, nonNullish} from '@dfinity/utils';
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
  type NavigationTypePayload,
  type PerformanceMetricNamePayload,
  type SatelliteIdText,
  type SetPageViewsRequest,
  type SetPageViewsRequestEntry,
  type SetPerformanceMetricRequestEntry,
  type SetTrackEventPayload,
  type SetTrackEventRequestEntry,
  type SetPerformanceMetricsRequest,
  type SetTrackEventsRequest
} from '../types/api.payload';
import type {Environment, EnvironmentActor} from '../types/env';
import type {IdbKey, IdbTrackEvent} from '../types/idb';
import type {PostMessage, PostMessageInitEnvData} from '../types/post-message';

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
      page_views: entries.map<SetPageViewsRequestEntry>(
        ([key, {collected_at, updated_at: _, referrer, version, user_agent, ...entry}]) => ({
          key: {key: key as IdbKey, collected_at},
          page_view: {
            referrer: fromNullable(referrer),
            version: fromNullable(version),
            user_agent: fromNullable(user_agent),
            ...entry
          }
        })
      )
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
    const toTrackEvent = ({
      metadata,
      updated_at: _,
      version,
      user_agent,

      ...rest
    }: Omit<IdbTrackEvent, 'collected_at'>): SetTrackEventPayload => ({
      metadata,
      version: fromNullable(version),
      user_agent: fromNullable(user_agent),
      ...rest
    });

    const request: SetTrackEventsRequest = {
      ...satelliteId(env as EnvironmentActor),
      track_events: entries.map<SetTrackEventRequestEntry>(([key, {collected_at, ...entry}]) => ({
        key: {key: key as IdbKey, collected_at},
        track_event: toTrackEvent(entry)
      }))
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
        ([
          key,
          {
            collected_at,
            metric_name,
            version,
            user_agent,
            data: {
              WebVitalsMetric: {navigation_type, ...webVitalsMetric}
            },
            ...entry
          }
        ]) => ({
          key: {key: key as IdbKey, collected_at},
          performance_metric: {
            version: fromNullable(version),
            user_agent: fromNullable(user_agent),
            metric_name: Object.keys(metric_name)[0] as PerformanceMetricNamePayload,
            data: {
              WebVitalsMetric: {
                ...webVitalsMetric,
                ...(nonNullish(fromNullable(navigation_type)) && {
                  navigation_type: Object.keys(
                    fromNullable(navigation_type) ?? {}
                  )[0] as NavigationTypePayload
                })
              }
            },
            ...entry
          }
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
