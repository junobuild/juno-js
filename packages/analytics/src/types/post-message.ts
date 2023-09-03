import type {Environment} from './env';

export type PostMessageRequest =
  | 'junoInitEnvironment'
  | 'junoTrackPageView'
  | 'junoTrackEvent'
  | 'junoStartTrackTimer'
  | 'junoStopTrackTimer';

export type PostMessageInitEnvData = Environment;

export interface PostMessage {
  msg: PostMessageRequest;
  data?: PostMessageInitEnvData;
}
