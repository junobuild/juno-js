import {assertNonNullish, nonNullish, toNullable} from '@dfinity/utils';
import {isBrowser} from '@junobuild/utils';
import {nanoid} from 'nanoid';
import type {Environment, EnvironmentWorker} from '../types/env';
import type {IdbPageView} from '../types/idb';
import type {PostMessageInitEnvData} from '../types/post-message';
import type {TrackEvent} from '../types/track';
import {timestamp, userAgent} from '../utils/analytics.utils';
import {warningWorkerNotInitialized} from '../utils/log.utils';
import {startPerformance} from './performance.services';

const initSessionId = (): string | undefined => {
  // I faced this issue when I used the library in Docusaurus which does not implement the crypto API when server-side rendering.
  // https://github.com/ai/nanoid/issues?q=crypto+not+defined
  if (typeof crypto === 'undefined') {
    return undefined;
  }

  return nanoid();
};

const sessionId = initSessionId();

let worker: Worker | undefined;

export const initWorker = (env: Environment): {cleanup: () => void} => {
  const {path}: EnvironmentWorker = env.worker ?? {};
  const workerUrl = path ?? './workers/analytics.worker.js';

  worker = new Worker(workerUrl);

  const consoleWarn = () =>
    console.warn('Unable to connect to the analytics web worker. Have you deployed it?');

  worker?.addEventListener('error', consoleWarn, false);

  initWorkerEnvironment(env);

  return {
    cleanup() {
      worker?.removeEventListener('error', consoleWarn, false);
    }
  };
};

export const initTrackPageViews = (): {cleanup: () => void} => {
  const trackPages = async () => await trackPageView();

  let pushStateProxy: typeof history.pushState | null = new Proxy(history.pushState, {
    // eslint-disable-next-line local-rules/prefer-object-params
    apply: async (
      target,
      thisArg,
      argArray: [data: unknown, unused: string, url?: string | URL | null | undefined]
    ) => {
      target.apply(thisArg, argArray);
      await trackPages();
    }
  });

  history.pushState = pushStateProxy;

  addEventListener('popstate', trackPages, {passive: true});

  return {
    cleanup() {
      pushStateProxy = null;
      removeEventListener('popstate', trackPages, false);
    }
  };
};

const SESSION_ID_UNDEFINED_MSG = 'No session ID initialized.';

export const setPageView = async () => {
  if (!isBrowser()) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);

  const {
    title,
    location: {href},
    referrer
  } = document;
  const {innerWidth, innerHeight} = window;
  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();

  const data: IdbPageView = {
    title,
    href,
    referrer: toNullable(nonNullish(referrer) && referrer !== '' ? referrer : undefined),
    device: {
      inner_width: innerWidth,
      inner_height: innerHeight
    },
    time_zone: timeZone,
    session_id: sessionId,
    ...userAgent(),
    ...timestamp()
  };

  const idb = await import('./idb.services');
  await idb.setPageView({
    key: nanoid(),
    view: data
  });
};

export const initTrackPerformance = async ({options}: Environment) => {
  if (!isBrowser()) {
    return;
  }

  if (options?.performance === false) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);

  await startPerformance(sessionId);
};

/**
 * Tracks a page view in Juno Analytics.
 * @returns {Promise<void>} A promise that resolves when the page view is tracked.
 */
export const trackPageView = async (): Promise<void> => {
  warningWorkerNotInitialized(worker);

  await setPageView();

  worker?.postMessage({msg: 'junoTrackPageView'});
};

/**
 * Tracks a custom event in Juno Analytics.
 * @param {TrackEvent} data - The event details.
 * @returns {Promise<void>} A promise that resolves when the event is tracked.
 */
export const trackEvent = async (data: TrackEvent): Promise<void> => {
  if (!isBrowser()) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);
  warningWorkerNotInitialized(worker);

  const idb = await import('./idb.services');
  await idb.setTrackEvent({
    key: nanoid(),
    track: {...data, session_id: sessionId, ...userAgent(), ...timestamp()}
  });

  worker?.postMessage({msg: 'junoTrackEvent'});
};

export const initWorkerEnvironment = (env: PostMessageInitEnvData) => {
  warningWorkerNotInitialized(worker);

  worker?.postMessage({msg: 'junoInitEnvironment', data: env});
};

export const startTracking = () => {
  warningWorkerNotInitialized(worker);

  worker?.postMessage({msg: 'junoStartTrackTimer'});
};

export const stopTracking = () => {
  warningWorkerNotInitialized(worker);

  worker?.postMessage({msg: 'junoStopTracker'});
};
