import type {AnalyticKey, SetPageView, SetTrackEvent} from '../../declarations/orbiter/orbiter.did';
import type {EnvironmentActor} from './env';

export type Proxy = {
  key: AnalyticKey;
} & Omit<EnvironmentActor, 'proxyUrl'>;

export type PageViewProxy = {
  pageView: SetPageView;
} & Proxy;

export type TrackEventProxy = {
  trackEvent: SetTrackEvent;
} & Proxy;
