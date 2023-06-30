import {setPageView} from '../services/idb.services';
import type {PostMessage, PostMessagePageView} from '../types/post-message';
import {PageView} from '../types/track';
import {nowInBigIntNanoSeconds} from '../utils/date.utils';

onmessage = async ({data: dataMsg}: MessageEvent<PostMessage>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoTrackPageView':
      await trackPageView(data);
    case 'junoTrackEvent':
    // TODO: implement
  }
};

const trackPageView = async (data: PostMessagePageView) => {
  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();
  const {userAgent} = navigator;

  const pageView: PageView = {
    ...data,
    timeZone,
    userAgent,
    collectedAt: nowInBigIntNanoSeconds()
  };

  await setPageView(pageView);
};
