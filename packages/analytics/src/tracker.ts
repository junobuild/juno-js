import {nanoid} from 'nanoid';
import {OrbiterServices} from './services/orbiter.services';
import {PerformanceServices} from './services/performance.services';
import {UserAgentServices} from './services/user-agent.services';
import type {Environment} from './types/env';
import type {SetPageViewPayload, SetPerformanceMetricRequestEntry} from './types/orbiter';
import type {TrackEvent} from './types/track';
import {campaign, timestamp, userAgent} from './utils/analytics.utils';
import {assertNonNullish} from './utils/dfinity/asserts.utils';
import {isNullish, nonNullish} from './utils/dfinity/nullish.utils';
import {isBrowser} from './utils/env.utils';
import {warningOrbiterServicesNotInitialized} from './utils/log.utils';

const initSessionId = (): string | undefined => {
  // I faced this issue when I used the library in Docusaurus which does not implement the crypto API when server-side rendering.
  // https://github.com/ai/nanoid/issues?q=crypto+not+defined
  if (typeof crypto === 'undefined') {
    return undefined;
  }

  return nanoid();
};

const sessionId = initSessionId();

interface Services {
  orbiter: OrbiterServices;
  /**
   * Developer opt-in feature.
   */
  userAgent: UserAgentServices | null;
  performance: PerformanceServices | null;
}

let services: Services | undefined | null;

export const initServices = (env: Environment): {cleanup: () => void} => {
  services = {
    orbiter: new OrbiterServices(env),
    userAgent: env.options?.userAgentParser === true ? new UserAgentServices() : null,
    performance: env.options?.performance === true ? new PerformanceServices() : null
  };

  return {
    cleanup() {
      services = null;
    }
  };
};

export const initTrackPageViews = (): {cleanup: () => void} => {
  const trackPages = async () => await trackPageViewAsync();

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
  const {innerWidth, innerHeight, screen: windowScreen} = window;
  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();

  const {user_agent} = userAgent();
  const client = nonNullish(services?.userAgent)
    ? await services?.userAgent.parseUserAgent(user_agent)
    : undefined;

  const {withCampaign, campaign: campaignData} = campaign();

  // Not gracious but the goal is to manipulate strictly only when needed for performance reasons.
  const cleanHref = (): string => {
    if (!withCampaign) {
      return href;
    }

    try {
      const url = new URL(href);

      Object.keys(campaignData ?? {}).forEach((key) => url.searchParams.delete(key));

      return url.href;
    } catch {
      // Unlikely to happen
      return href;
    }
  };

  const page_view: SetPageViewPayload = {
    title,
    href: cleanHref(),
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
    ...(nonNullish(client) && {client}),
    ...(nonNullish(campaignData) && {campaign: campaignData})
  };

  warningOrbiterServicesNotInitialized(services);

  await services?.orbiter?.setPageView({
    key: {
      key: nanoid(),
      ...timestamp()
    },
    page_view
  });
};

export const startTrackPerformance = async () => {
  if (!isBrowser()) {
    return;
  }

  if (isNullish(services?.performance)) {
    return;
  }

  assertNonNullish(sessionId, SESSION_ID_UNDEFINED_MSG);

  warningOrbiterServicesNotInitialized(services);

  const postPerformanceMetric = async (entry: SetPerformanceMetricRequestEntry) => {
    warningOrbiterServicesNotInitialized(services);

    await services?.orbiter?.setPerformanceMetric(entry);
  };

  await services.performance.startPerformance({sessionId, postPerformanceMetric});
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
 * @returns {Promise<void>} A promise that resolves when the page view is tracked.
 */
export const trackPageViewAsync = async (): Promise<void> => {
  await setPageView();
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

  warningOrbiterServicesNotInitialized(services);

  await services?.orbiter?.setTrackEvent({
    key: {
      key: nanoid(),
      ...timestamp()
    },
    track_event: {...data, session_id: sessionId, ...userAgent(), ...timestamp()}
  });
};
