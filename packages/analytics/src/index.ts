import {
  initOrbiterServices,
  initTrackPageViews,
  initTrackPerformance,
  setPageView
} from './services/analytics.services';
import type {Environment, UserEnvironment} from './types/env';
import {assertNonNullish} from './utils/dfinity/asserts.utils';
import {envContainer, envOrbiterId, envSatelliteId} from './utils/window.env.utils';

export {trackEvent, trackPageView} from './services/analytics.services';
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
    worker: userEnv?.worker,
    options: userEnv?.options
  };
};

/**
 * Initializes the Juno Analytics.
 * @param {UserEnvironment} [userEnv] - The optional user environment configuration. If no environment is provided, the variables injected by the Vite or NextJS plugins will be used.
 * @returns {Promise<() => void>} A promise that resolves to a cleanup function that stops tracking and cleans up resources.
 */
export const initOrbiter = async (userEnv?: UserEnvironment): Promise<() => void> => {
  const env = parseEnv(userEnv);

  const {cleanup: orbiterServicesCleanup} = initOrbiterServices(env);

  // Save first page as soon as possible
  await setPageView();

  const {cleanup: pushHistoryCleanup} = initTrackPageViews();

  await initTrackPerformance(env);

  return () => {
    orbiterServicesCleanup();
    pushHistoryCleanup();
  };
};
