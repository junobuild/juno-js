import {initTrackPageViews, initWorker, trackPageView} from './services/track.services';
import type {Environment} from './types/env';

export {trackEvent, trackPageView} from './services/track.services';
export * from './types/env';

export const initJunoAnalytics = ({worker}: Environment = {}): {cleanup: () => void} => {
  initWorker(worker);

  // TODO: option to disable auto track pageviews
  const {cleanup} = initTrackPageViews();

  // Tack first page
  trackPageView();

  return {cleanup};
};
