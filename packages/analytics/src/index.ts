import {
  initTrackPageViews,
  initWorker,
  trackPageView,
  trackSync
} from './services/analytics.services';
import type {Environment} from './types/env';

export {trackEvent, trackPageView} from './services/analytics.services';
export * from './types/env';
export * from './types/proxy';

export const initOrbiter = async (env: Environment): Promise<() => void> => {
  // Tack first page
  await trackPageView();

  initWorker(env);

  const {cleanup} = initTrackPageViews();

  // Sync page views, the first page above and those from previous sessions
  // Sync track events in case there are remaining events from a previous session
  trackSync();

  return () => {
    cleanup();
  };
};
