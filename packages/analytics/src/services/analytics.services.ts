import {assertNonNullish, nonNullish, toNullable} from '@junobuild/utils';
import type {Environment, EnvironmentWorker} from '../types/env';
import type {PostMessageInitAnalytics, PostMessagePageView} from '../types/post-message';
import type {TrackEvent} from '../types/track';

let worker: Worker | undefined;

export const initWorker = (env: Environment) => {
  const {path}: EnvironmentWorker = env.worker ?? {};
  const workerUrl = path === undefined ? './workers/analytics.worker.js' : path;

  worker = new Worker(workerUrl);

  initWorkerEnvironment(env);
};

export const initTrackPageViews = (): {cleanup: () => void} => {
  let pushStateProxy: typeof history.pushState | null = new Proxy(history.pushState, {
    apply: (
      target,
      thisArg,
      argArray: [data: unknown, unused: string, url?: string | URL | null | undefined]
    ) => {
      target.apply(thisArg, argArray);
      trackPageView();
    }
  });

  history.pushState = pushStateProxy;

  addEventListener('popstate', trackPageView, {passive: true});

  return {
    cleanup() {
      pushStateProxy = null;
      removeEventListener('popstate', trackPageView, false);
    }
  };
};

const WORKER_UNDEFINED_MSG =
  'Analytics worker not initialized. Did you call `initWorker`?' as const;

export const trackPageView = () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  const {
    title,
    location: {href},
    referrer
  } = document;
  const {innerWidth, innerHeight} = window;

  const data: PostMessagePageView = {
    title,
    href,
    referrer: toNullable(nonNullish(referrer) && referrer !== '' ? referrer : undefined),
    device: {
      inner_width: innerWidth,
      inner_height: innerHeight
    }
  };

  worker?.postMessage({msg: 'junoTrackPageView', data});
};

export const trackEvent = (data: TrackEvent) => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker?.postMessage({msg: 'junoTrackEvent', data});
};

export const initWorkerEnvironment = (env: PostMessageInitAnalytics) => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker?.postMessage({msg: 'junoInitEnvironment', data: env});
};

export const startTracking = () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker?.postMessage({msg: 'junoStartTimer'});
};

export const stopTracking = () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker?.postMessage({msg: 'junoStopTimer'});
};
