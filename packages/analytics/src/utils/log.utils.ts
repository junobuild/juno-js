import {isNullish} from './dfinity/nullish.utils';

const ORBITER_SERVICES_UNDEFINED_MSG =
  'Unable to connect to the analytics services. Did you call `initOrbiter`?';

export const warningOrbiterServicesNotInitialized = <T>(value: T) => {
  if (isNullish(value)) {
    console.warn(ORBITER_SERVICES_UNDEFINED_MSG);
  }
};
