import {isBrowser} from '../utils/env.utils';

export interface Log {
  msg: string;
  level: 'info' | 'error';
  duration?: number;
}

export const log = (detail: Log) => {
  if (!isBrowser() && detail.level === 'info') {
    console.log(detail.msg);
    return;
  }

  if (!isBrowser() && detail.level === 'error') {
    console.error(detail.msg);
    return;
  }

  const $event: CustomEvent<Log> = new CustomEvent<Log>('ddgLog', {detail, bubbles: true});
  document.dispatchEvent($event);
};
