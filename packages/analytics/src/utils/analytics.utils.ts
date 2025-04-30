import UAParser from 'ua-parser-js';
import type {PageViewClient} from '../types/orbiter';
import {nowInBigIntNanoSeconds} from './date.utils';
import {isNullish, nonNullish} from './dfinity/nullish.utils';

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

export const userClient = (user_agent: string | undefined): PageViewClient | undefined => {
  const parser = new UAParser(user_agent);
  const {browser, os, device} = parser.getResult();

  if (isNullish(browser.name) || isNullish(os.name)) {
    return undefined;
  }

  return {
    browser: browser.name,
    os: os.name,
    device: device?.type
  };
};
