import {PageView} from './track';

export type PostMessageRequest =
  | 'junoStartTimer'
  | 'junoStopTimer'
  | 'junoTrackPageView'
  | 'junoTrackEvent';

export type PostMessagePageView = Omit<PageView, 'timeZone' | 'userAgent' | 'collectedAt'>;

export interface PostMessage {
  msg: PostMessageRequest;
  // TODO: track event
  data: PostMessagePageView;
}
