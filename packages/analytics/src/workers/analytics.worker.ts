import {isNullish} from '@junobuild/utils';
import {delPageViews, getPageViews, setPageView} from '../services/idb.services';
import type {PostMessage, PostMessagePageView} from '../types/post-message';
import {PageView} from '../types/track';
import {nowInBigIntNanoSeconds} from '../utils/date.utils';

onmessage = async ({data: dataMsg}: MessageEvent<PostMessage>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoStartTimer':
      await startTimer();
      return;
    case 'junoStopTimer':
      stopTimer();
      return;
    case 'junoTrackPageView':
      await trackPageView(data);
      return;
    case 'junoTrackEvent':
    // TODO: implement
  }
};

let timer: NodeJS.Timeout | undefined = undefined;

const stopTimer = () => {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
};

const startTimer = async () => {
  // Avoid re-starting the timer
  if (timer !== undefined) {
    return;
  }

  const execute = async () => await syncPageViews();

  // We starts now but also schedule the update after wards
  await execute();

  // TODO: 1000 should be a parameter
  timer = setInterval(execute, 1000);
};

let inProgress = false;

const syncPageViews = async () => {
  // One batch at a time to avoid to process multiple times the same entries
  if (inProgress) {
    return;
  }

  const entries = await getPageViews();

  if (isNullish(entries) || entries.length === 0) {
    // Nothing to do
    return;
  }

  inProgress = true;

  // TODO: persist pages views
  console.log(entries);

  await delPageViews(entries.map(([key, _]) => key));

  inProgress = false;
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
