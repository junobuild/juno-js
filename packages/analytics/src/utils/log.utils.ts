import {isNullish} from './dfinity/nullish.utils';

const WORKER_UNDEFINED_MSG = 'Analytics worker not initialized. Did you call `initOrbiter`?';
const ORBITER_SERVICES_UNDEFINED_MSG = 'Unable to connect to the analytics services. Did you call `initOrbiter`?'

export const warningWorkerNotInitialized = <T>(value: T) => {
  if (isNullish(value)) {
    console.warn(WORKER_UNDEFINED_MSG);
  }
};

export const warningOrbiterServicesNotInitialized = <T>(value: T) => {
  if (isNullish(value)) {
    console.warn(ORBITER_SERVICES_UNDEFINED_MSG);
  }
};
