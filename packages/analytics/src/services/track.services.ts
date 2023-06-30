import {EnvironmentWorker} from '../types/env';
import {PostMessagePageView} from '../types/post-message';
import {assertNonNullish, isNullish} from '../utils/utils';

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
      argArray: [data: any, unused: string, url?: string | URL | null | undefined]
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

export const trackEvent = () => {
  assertNonNullish(worker, WORKER_UNDEFINED_MSG);

  worker.postMessage({msg: 'junoTrackEvent'});
};
