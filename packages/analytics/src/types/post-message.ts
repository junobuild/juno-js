import type {EnvironmentActor} from './env';

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
