import {assertNonNullish, isNullish} from '@junobuild/utils';
import type {EnvironmentWorker} from '../types/env';
import type {PostMessagePageView} from '../types/post-message';
import type {TrackEvent} from '../types/track';

let worker: Worker | undefined;

export const initWorker = ({path}: EnvironmentWorker = {}) => {
  const workerUrl = isNullish(path) ? './workers/analytics.worker.js' : path;
  worker = new Worker(workerUrl);
};

export const initTrackPageViews = (): {cleanup: () => void} => {
  let pushStateProxy: typeof history.pushState | null = new Proxy(history.pushState, {
    apply: (
      target,
      thisArg,
      argArray: [data: unknown, unused: string, url?: string | URL | null | undefined]
    ) => {
      trackPageView();

      return target.apply(thisArg, argArray);
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
    referrer,
    device: {
      innerWidth,
      innerHeight
    }
  };

  worker.postMessage({msg: 'junoTrackPageView', data});
};

export const trackEvent = <T>(data: TrackEvent<T>) => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker.postMessage({msg: 'junoTrackEvent', data});
};

export const startTracking = () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker.postMessage({msg: 'junoStartTimer'});
};

export const stopTracking = () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker.postMessage({msg: 'junoStopTimer'});
};
