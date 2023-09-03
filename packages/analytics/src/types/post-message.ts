import type {EnvironmentActor} from './env';

export type PostMessageRequest =
  | 'junoInitEnvironment'
  | 'junoTrackPageView'
  | 'junoTrackEvent'
  | 'junoStartTrackTimer'
  | 'junoStopTrackTimer';

export type PostMessageInitAnalytics = EnvironmentActor;

export interface PostMessage {
  msg: PostMessageRequest;
  data?: PostMessageInitAnalytics;
}
