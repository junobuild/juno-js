import {
  initTrackPageViews,
  initWorker,
  setPageView,
  startTracking,
  stopTracking
} from './services/analytics.services';
import type {Environment} from './types/env';

export {trackEvent, trackPageView} from './services/analytics.services';
export * from './types/env';

export const initOrbiter = async (env: Environment): Promise<() => void> => {
  // Save first page as soon as possible
  await setPageView();

  initWorker(env);

  const {cleanup} = initTrackPageViews();

  // Starting tracking will instantly sync the first page and the data from previous sessions that have not been synced yet
  startTracking();

  return () => {
    stopTracking();
    cleanup();
  };
};
