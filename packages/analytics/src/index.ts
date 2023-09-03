import {
  initTrackPageViews,
  initWorker,
  startTracking,
  stopTracking,
  trackPageView
} from './services/analytics.services';
import type {Environment} from './types/env';

export {trackEvent, trackPageView} from './services/analytics.services';
export * from './types/env';
export * from './types/proxy';

export const initOrbiter = async (env: Environment): Promise<() => void> => {
  // Track first page as soon as possible
  await trackPageView();

  initWorker(env);

  const {cleanup} = initTrackPageViews();

  // Starting tracking will instantly sync the first page and the data from previous sessions that have not been synced yet
  startTracking();

  return () => {
    stopTracking();
    cleanup();
  };
};
