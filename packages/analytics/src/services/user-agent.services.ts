import type {PageViewClient} from '../types/orbiter';
import {isNullish} from '../utils/dfinity/nullish.utils';

export const parseUserAgent = async (
  user_agent: string | undefined
): Promise<PageViewClient | undefined> => {
  const {UAParser} = await import('ua-parser-js');

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
