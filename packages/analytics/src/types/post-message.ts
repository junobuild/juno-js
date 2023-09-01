import type {SetPageView} from '../../declarations/orbiter/orbiter.did';
import type {EnvironmentActor} from './env';
import type {TrackEvent} from './track';

export type PostMessageRequest =
  | 'junoInitEnvironment'
  | 'junoStartTimer'
  | 'junoStopTimer'
  | 'junoTrackPageView'
  | 'junoTrackEvent';

export type PostMessageInitAnalytics = EnvironmentActor;

export type PostMessagePageView = Omit<
  SetPageView,
  'time_zone' | 'user_agent' | 'collected_at' | 'updated_at'
>;

export type PostMessageTrackEvent = TrackEvent;

export interface PostMessage {
  msg: PostMessageRequest;
  data: PostMessageInitAnalytics | PostMessagePageView | PostMessageTrackEvent;
}
