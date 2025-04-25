import {nonNullish} from '@dfinity/utils';
import {nowInBigIntNanoSeconds} from './date.utils';

export const timestamp = (): {
  collected_at: bigint;
  version?: bigint;
} => ({
  collected_at: nowInBigIntNanoSeconds()
});

export const userAgent = (): {user_agent?: string} => {
  const {userAgent} = navigator;
  return nonNullish(userAgent) ? {user_agent: userAgent} : {};
};
