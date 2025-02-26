import {isNullish} from '@dfinity/utils';

const WORKER_UNDEFINED_MSG = 'Analytics worker not initialized. Did you call `initOrbiter`?';

export const warningWorkerNotInitialized = <T>(value: T) => {
  if (isNullish(value)) {
    console.warn(WORKER_UNDEFINED_MSG);
  }
};
