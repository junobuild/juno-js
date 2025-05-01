import {
  initServices,
  initTrackPageViews,
  initTrackPerformance,
  setPageView
} from './services/analytics.services';
import type {Environment, UserEnvironment} from './types/env';
import {assertNonNullish} from './utils/dfinity/asserts.utils';
import {envContainer, envOrbiterId, envSatelliteId} from './utils/window.env.utils';

export {
  trackEvent,
  trackEventAsync,
  trackPageView,
  trackPageViewAsync
} from './services/analytics.services';
export type * from './types/env';

const parseEnv = (userEnv?: UserEnvironment): Environment => {
  const satelliteId = userEnv?.satelliteId ?? envSatelliteId();

  assertNonNullish(
    satelliteId,
    'Satellite ID is not configured. Orbiter cannot be initialized without a target Satellite.'
  );

  const orbiterId = userEnv?.orbiterId ?? envOrbiterId();

  assertNonNullish(
    orbiterId,
    'Orbiter ID is not configured. The analytics cannot be initialized without an Orbiter.'
  );

  const container = userEnv?.container ?? envContainer();

  return {
    orbiterId,
    satelliteId,
    container,
    options: userEnv?.options
  };
};

/**
 * Initializes the Juno Analytics.
 *
 * Although this function is synchronous, it triggers asynchronous tracking of the initial page view
 * and, optionally, the initialization of web vitals, without awaiting their completion.
 * This design ensures better performance and avoids blocking your application's boot time.
 *
 * @param {UserEnvironment} [userEnv] - The optional user environment configuration. If no environment is provided, the variables injected by the Vite or NextJS plugins will be used.
 * @returns {() => void} A cleanup function that removes hooks (such as navigation tracking) added for analytics.
 */
export const initOrbiter = (userEnv?: UserEnvironment): (() => void) => {
  const env = parseEnv(userEnv);

  const {cleanup: analyticsServicesCleanup} = initServices(env);

  // Save first page as soon as possible.
  // We do not await on purpose to not block the application's boot.
  setPageView();

  const {cleanup: pushHistoryCleanup} = initTrackPageViews();

  // We do not await on purpose to not block the application's boot.
  initTrackPerformance(env);

  return () => {
    analyticsServicesCleanup();
    pushHistoryCleanup();
  };
};
