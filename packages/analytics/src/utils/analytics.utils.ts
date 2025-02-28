import {toNullable} from '@dfinity/utils';
import {nowInBigIntNanoSeconds} from './date.utils';

export const timestamp = (): {
  collected_at: bigint;
  updated_at: [] | [bigint];
  version: [] | [bigint];
} => ({
  collected_at: nowInBigIntNanoSeconds(),
  updated_at: [],
  version: []
});

export const userAgent = (): {user_agent: [] | [string]} => {
  const {userAgent} = navigator;
  return {user_agent: toNullable(userAgent)};
};
