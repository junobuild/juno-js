import {
  initTrackPageViews,
  initWorker,
  startTracking,
  stopTracking,
  trackPageView
} from './services/track.services';
import type {Environment} from './types/env';
import {EnvStore} from "@junobuild/core/src/stores/env.store";

export {trackEvent, trackPageView} from './services/track.services';
export * from './types/env';

export const initOrbiter = async (env: Environment): Promise<(() => void)> => {
  const {worker, ...rest} = env;

  initWorker(worker);

  // TODO: option to disable auto track pageviews
  const {cleanup} = initTrackPageViews();

  // Tack first page
  trackPageView();

  // Start synchronization (that way previous page view is instantly processed)
  startTracking(rest);

  return () => {
    stopTracking();
    cleanup();
  };
};