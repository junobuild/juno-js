import {
  initTrackPageViews,
  initWorker,
  syncTrackEvents,
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

  // Sync track events in case there are remaining events from a previous session
  syncTrackEvents();

  return () => {
    cleanup();
  };
};
