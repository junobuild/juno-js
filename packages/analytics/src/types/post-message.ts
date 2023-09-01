import type {SetPageView} from '../../declarations/orbiter/orbiter.did';
import type {EnvironmentProxy} from './env';
import type {TrackEvent} from './track';

export type PostMessageRequest = 'junoInitEnvironment' | 'junoTrackPageView' | 'junoTrackEvent';

export type PostMessageInitAnalytics = EnvironmentProxy;

export type PostMessagePageView = Omit<
  SetPageView,
  'time_zone' | 'user_agent' | 'collected_at' | 'updated_at'
>;

export type PostMessageTrackEvent = TrackEvent;

export interface PostMessage {
  msg: PostMessageRequest;
  data: PostMessageInitAnalytics | PostMessagePageView | PostMessageTrackEvent;
}
