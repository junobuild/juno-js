import {assertNonNullish, isBrowser, nonNullish, toNullable} from '@junobuild/utils';
import type {Environment, EnvironmentWorker} from '../types/env';
import type {IdbPageView} from '../types/idb';
import type {PostMessageInitEnvData} from '../types/post-message';
import type {TrackEvent} from '../types/track';

let worker: Worker | undefined;

export const initWorker = (env: Environment) => {
  const {path}: EnvironmentWorker = env.worker ?? {};
  const workerUrl = path === undefined ? './workers/analytics.worker.js' : path;

  worker = new Worker(workerUrl);

  initWorkerEnvironment(env);
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
  'Analytics worker not initialized. Did you call `initWorker`?' as const;

export const setPageView = async () => {
  if (!isBrowser()) {
    return;
  }

  const {
    title,
    location: {href},
    referrer
  } = document;
  const {innerWidth, innerHeight} = window;

  const data: IdbPageView = {
    title,
    href,
    referrer: toNullable(nonNullish(referrer) && referrer !== '' ? referrer : undefined),
    device: {
      inner_width: innerWidth,
      inner_height: innerHeight
    }
  };

  const idb = await import('./idb.services');
  await idb.setPageView(data);
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

  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  const idb = await import('./idb.services');
  await idb.setTrackEvent(data);

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

  worker?.postMessage({msg: 'junoStopTrackTimer'});
};
