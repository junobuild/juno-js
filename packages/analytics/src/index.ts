import {
  initTrackPageViews,
  initWorker,
  trackPageView
} from './services/analytics.services';
import type {Environment} from './types/env';

export {trackEvent, trackPageView} from './services/analytics.services';
export * from './types/env';
export * from './types/proxy';

export const initOrbiter = async (env: Environment): Promise<() => void> => {
  initWorker(env);

  const {cleanup} = initTrackPageViews();

  // Tack first page
  trackPageView({debounce: false});

  return () => {
    cleanup();
  };
};
