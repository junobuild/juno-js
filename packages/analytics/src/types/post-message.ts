import type {Environment} from './env';

export type PostMessageRequest =
  | 'junoInitEnvironment'
  | 'junoTrackPageView'
  | 'junoTrackEvent'
  | 'junoStartTrackTimer'
  | 'junoStopTracker';

export type PostMessageInitEnvData = Environment;

export interface PostMessage {
  msg: PostMessageRequest;
  data?: PostMessageInitEnvData;
}
