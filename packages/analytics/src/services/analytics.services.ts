import {assertNonNullish, isBrowser, nonNullish, toNullable} from '@junobuild/utils';
import {nanoid} from 'nanoid';
import type {Environment, EnvironmentWorker} from '../types/env';
import type {IdbPageView} from '../types/idb';
import type {PostMessageInitEnvData} from '../types/post-message';
import type {TrackEvent} from '../types/track';
import {timestamp, userAgent} from '../utils/analytics.utils';

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
  const workerUrl = path === undefined ? './workers/analytics.worker.js' : path;

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

const WORKER_UNDEFINED_MSG =
  'Analytics worker not initialized. Did you call `initOrbiter`?' as const;
const SESSION_ID_UNDEFINED_MSG = 'No session ID initialized.' as const;

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
    ...userAgent(),
    ...timestamp()
  };

  const idb = await import('./idb.services');
  await idb.setPageView({
    sessionId,
    key: nanoid(),
    view: data
  });
};

export const trackPageView = async () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  await setPageView();

  worker?.postMessage({msg: 'junoTrackPageView'});
};

export const trackEvent = async (data: TrackEvent) => {
  if (!isBrowser()) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  const idb = await import('./idb.services');
  await idb.setTrackEvent({
    sessionId,
    key: nanoid(),
    track: {...data, ...userAgent(), ...timestamp()}
  });

  worker?.postMessage({msg: 'junoTrackEvent'});
};

export const initWorkerEnvironment = (env: PostMessageInitEnvData) => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker?.postMessage({msg: 'junoInitEnvironment', data: env});
};

export const startTracking = () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker?.postMessage({msg: 'junoStartTrackTimer'});
};

export const stopTracking = () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker?.postMessage({msg: 'junoStopTracker'});
};
