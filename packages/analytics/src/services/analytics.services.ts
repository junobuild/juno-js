import {nanoid} from 'nanoid';
import type {Environment, EnvironmentOptions} from '../types/env';
import type {SetPageViewPayload, SetPerformanceMetricRequestEntry} from '../types/orbiter';
import type {TrackEvent} from '../types/track';
import {timestamp, userAgent} from '../utils/analytics.utils';
import {assertNonNullish} from '../utils/dfinity/asserts.utils';
import {nonNullish} from '../utils/dfinity/nullish.utils';
import {isBrowser} from '../utils/env.utils';
import {warningOrbiterServicesNotInitialized} from '../utils/log.utils';
import {OrbiterServices} from './orbiter.services';
import {startPerformance} from './performance.services';
import {parseUserAgent} from './user-agent.services';

type SetPageViewParams = Pick<EnvironmentOptions, 'userAgentParser'>;

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

export const initTrackPageViews = (params: SetPageViewParams = {}): {cleanup: () => void} => {
  const trackPages = async () => await trackPageViewAsync(params);

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

export const setPageView = async ({userAgentParser}: SetPageViewParams = {}) => {
  if (!isBrowser()) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);

  const {
    title,
    location: {href},
    referrer
  } = document;
  const {innerWidth, innerHeight, screen: windowScreen} = window;
  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();

  const {user_agent} = userAgent();
  const client = userAgentParser === true ? await parseUserAgent(user_agent) : undefined;

  const page_view: SetPageViewPayload = {
    title,
    href,
    ...(nonNullish(referrer) && referrer !== '' && {referrer}),
    device: {
      inner_width: innerWidth,
      inner_height: innerHeight,
      screen_width: windowScreen?.availWidth,
      screen_height: windowScreen?.availHeight
    },
    time_zone: timeZone,
    session_id: sessionId,
    user_agent,
    ...(nonNullish(client) && {client})
  };

  warningOrbiterServicesNotInitialized(orbiterServices);

  await orbiterServices?.setPageView({
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
 *
 * This function does not return a promise, as it triggers the tracking request without awaiting its completion.
 * It is designed for fire-and-forget usage to avoid blocking application flow.
 */
export const trackPageView = () => {
  trackPageViewAsync();
};

/**
 * Tracks a page view in Juno Analytics.
 * @param {Pick<EnvironmentOptions, 'userAgentParser'>} [params] Optional user agent parser config.
 * @returns {Promise<void>} A promise that resolves when the page view is tracked.
 */
export const trackPageViewAsync = async (params: SetPageViewParams = {}): Promise<void> => {
  await setPageView(params);
};

/**
 * Tracks a custom event in Juno Analytics.
 *
 * This function does not return a promise, as it triggers the tracking request without awaiting its completion.
 * It is designed for fire-and-forget usage to avoid blocking application flow.
 *
 * @param {TrackEvent} data - The event details.
 */
export const trackEvent = (data: TrackEvent) => {
  trackEventAsync(data);
};

/**
 * Tracks a custom event in Juno Analytics.
 * @param {TrackEvent} data - The event details.
 * @returns {Promise<void>} A promise that resolves when the event is tracked.
 */
export const trackEventAsync = async (data: TrackEvent): Promise<void> => {
  if (!isBrowser()) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);

  warningOrbiterServicesNotInitialized(orbiterServices);

  await orbiterServices?.setTrackEvent({
    key: {
      key: nanoid(),
      ...timestamp()
    },
    track_event: {...data, session_id: sessionId, ...userAgent(), ...timestamp()}
  });
};
