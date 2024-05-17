import {assertNonNullish, envContainer, envOrbiterId, envSatelliteId} from '@junobuild/utils';
import {
  initTrackPageViews,
  initWorker,
  setPageView,
  startTracking,
  stopTracking
} from './services/analytics.services';
import type {Environment, UserEnvironment} from './types/env';

export {trackEvent, trackPageView} from './services/analytics.services';
export * from './types/env';

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
    worker: userEnv?.worker
  };
};

export const initOrbiter = async (userEnv?: UserEnvironment): Promise<() => void> => {
  // Save first page as soon as possible
  await setPageView();

  const env = parseEnv(userEnv);

  const {cleanup: workerCleanup} = initWorker(env);

  const {cleanup: pushHistoryCleanup} = initTrackPageViews();

  // Starting tracking will instantly sync the first page and the data from previous sessions that have not been synced yet
  startTracking();

  return () => {
    stopTracking();
    workerCleanup();
    pushHistoryCleanup();
  };
};
