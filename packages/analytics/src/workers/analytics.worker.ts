import type {PostMessage, PostMessagePageView} from '../types/post-message';

onmessage = ({data: dataMsg}: MessageEvent<PostMessage>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoTrackPageView':
      trackPageView(data);
    case "junoTrackEvent":
      // TODO: implement
  }
};

const trackPageView = (data: PostMessagePageView) => {
  const {timeZone} = Intl.DateTimeFormat().resolvedOptions();
  const {userAgent} = navigator;

  const pageView = {
    ...data,
    timeZone,
    userAgent
  };

  // TODO
  console.log(pageView)
};
