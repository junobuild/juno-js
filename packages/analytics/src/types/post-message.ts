import {EnvironmentProxy} from './env';
import type {PageView, TrackEvent} from './track';

export type PostMessageRequest = 'junoInitEnvironment' | 'junoTrackPageView' | 'junoTrackEvent';

export type PostMessageInitAnalytics = EnvironmentProxy;

export type PostMessagePageView = Omit<
  PageView,
  'sessionId' | 'timeZone' | 'userAgent' | 'collectedAt'
>;

export type PostMessageTrackEvent<T> = Omit<TrackEvent<T>, 'sessionId'>;

export interface PostMessage<D, T extends PostMessagePageView | PostMessageTrackEvent<T>> {
  msg: PostMessageRequest;
  data: D;
}
