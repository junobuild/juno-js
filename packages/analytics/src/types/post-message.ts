import type {SetPageView} from '../../declarations/orbiter/orbiter.did';
import type {EnvironmentActor} from './env';
import type {TrackEvent} from './track';

export type PostMessageRequest =
  | 'junoInitEnvironment'
  | 'junoTrackPageView'
  | 'junoTrackEvent'
  | 'junoTrackSync';

export type PostMessageInitAnalytics = EnvironmentActor;

export interface PostMessage {
  msg: PostMessageRequest;
  data?: PostMessageInitAnalytics;
}
