import {PageView} from './track';

export type PostMessageRequest = 'junoTrackPageView' | 'junoTrackEvent';

export type PostMessagePageView = Omit<PageView, 'timeZone' | 'userAgent'>;

export interface PostMessage {
  msg: PostMessageRequest;
  // TODO: track event
  data: PostMessagePageView;
}
