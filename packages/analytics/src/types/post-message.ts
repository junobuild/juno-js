import type {SetPageView} from '../../declarations/orbiter/orbiter.did';
import type {EnvironmentActor} from './env';
import type {TrackEvent} from './track';

export type PostMessageRequest =
  | 'junoInitEnvironment'
  | 'junoTrackPageView'
  | 'junoTrackEvent'
  | 'junoSyncTrackEvents';

export type PostMessageInitAnalytics = EnvironmentActor;

export type PostMessagePageView = Omit<
  SetPageView,
  'time_zone' | 'user_agent' | 'collected_at' | 'updated_at'
> & {debounce: boolean};

export type PostMessageTrackEvent = TrackEvent;

export interface PostMessage {
  msg: PostMessageRequest;
  data: PostMessageInitAnalytics | PostMessagePageView | PostMessageTrackEvent;
}
