import {nanoid} from 'nanoid';
import {SetPageViewPayload, SetPerformanceMetricRequestEntry} from '../types/api.payload';
import type {Environment} from '../types/env';
import type {TrackEvent} from '../types/track';
import {timestamp, userAgent} from '../utils/analytics.utils';
import {assertNonNullish} from '../utils/dfinity/asserts.utils';
import {nonNullish} from '../utils/dfinity/nullish.utils';
import {isBrowser} from '../utils/env.utils';
import {warningOrbiterServicesNotInitialized} from '../utils/log.utils';
import {OrbiterServices} from './orbiter.services';
import {startPerformance} from './performance.services';

const initSessionId = (): string | undefined => {
  // I faced this issue when I used the library in Docusaurus which does not implement the crypto API when server-side rendering.
  // https://github.com/ai/nanoid/issues?q=crypto+not+defined
  if (typeof crypto === 'undefined') {
    return undefined;
  }

  return nanoid();
};

const sessionId = initSessionId();

let orbiterServices: OrbiterServices | undefined | null;

export const initOrbiterServices = (env: Environment): {cleanup: () => void} => {
  orbiterServices = new OrbiterServices(env);

  return {
    cleanup() {
      orbiterServices = null;
    }
  };
};

export const initTrackPageViews = (): {cleanup: () => void} => {
  const trackPages = async () => await trackPageView();

  let pushStateProxy: typeof history.pushState | null = new Proxy(history.pushState, {
    // eslint-disable-next-line local-rules/prefer-object-params
    apply: async (
      target,
      thisArg,
      argArray: [data: unknown, unused: string, url?: string | URL | null | undefined]
    ) => {
      target.apply(thisArg, argArray);
      await trackPages();
    }
  });

  history.pushState = pushStateProxy;

  addEventListener('popstate', trackPages, {passive: true});

  return {
    cleanup() {
      pushStateProxy = null;
      removeEventListener('popstate', trackPages, false);
    }
  };
};

const SESSION_ID_UNDEFINED_MSG = 'No session ID initialized.';

export const setPageView = async () => {
  if (!isBrowser()) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);

  const {
    title,
    location: {href},
    referrer
  } = document;
  const {innerWidth, innerHeight} = window;
  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();

  const page_view: SetPageViewPayload = {
    title,
    href,
    ...(nonNullish(referrer) && referrer !== '' && {referrer}),
    device: {
      inner_width: innerWidth,
      inner_height: innerHeight
    },
    time_zone: timeZone,
    session_id: sessionId,
    ...userAgent()
  };

  warningOrbiterServicesNotInitialized(orbiterServices);

  orbiterServices?.setPageView({
    key: {
      key: nanoid(),
      ...timestamp()
    },
    page_view
  });
};

export const initTrackPerformance = async ({options}: Environment) => {
  if (!isBrowser()) {
    return;
  }

  if (options?.performance === false) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);

  warningOrbiterServicesNotInitialized(orbiterServices);

  const postPerformanceMetric = async (entry: SetPerformanceMetricRequestEntry) => {
    warningOrbiterServicesNotInitialized(orbiterServices);

    await orbiterServices?.setPerformanceMetric(entry);
  };

  await startPerformance({sessionId, postPerformanceMetric});
};

/**
 * Tracks a page view in Juno Analytics.
 * @returns {Promise<void>} A promise that resolves when the page view is tracked.
 */
export const trackPageView = async (): Promise<void> => {
  await setPageView();
};

/**
 * Tracks a custom event in Juno Analytics.
 * @param {TrackEvent} data - The event details.
 * @returns {Promise<void>} A promise that resolves when the event is tracked.
 */
export const trackEvent = async (data: TrackEvent): Promise<void> => {
  if (!isBrowser()) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);

  warningOrbiterServicesNotInitialized(orbiterServices);

  orbiterServices?.setTrackEvent({
    key: {
      key: nanoid(),
      ...timestamp()
    },
    track_event: {...data, session_id: sessionId, ...userAgent(), ...timestamp()}
  });
};
