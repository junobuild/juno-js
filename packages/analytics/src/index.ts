import {initTrackPageViews, initWorker, trackPageView} from './services/analytics.services';
import type {Environment} from './types/env';

export {trackEvent, trackPageView} from './services/analytics.services';
export * from './types/env';
export * from './types/proxy';

export const initOrbiter = async (env: Environment): Promise<() => void> => {
  initWorker(env);

  // TODO: option to disable auto track pageviews
  const {cleanup} = initTrackPageViews();

  // Tack first page
  trackPageView();

  return () => {
    cleanup();
  };
};
