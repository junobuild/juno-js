import {isNullish} from '@junobuild/utils';
import {toArray} from '@junobuild/utils/src';
import {
  delPageViews,
  delTrackEvents,
  getPageViews,
  getTrackEvents,
  setPageView,
  setTrackEvent
} from '../services/idb.services';
import type {PostMessage, PostMessagePageView} from '../types/post-message';
import {PostMessageTrackEvent} from '../types/post-message';
import {PageView} from '../types/track';
import {nowInBigIntNanoSeconds} from '../utils/date.utils';

onmessage = async <D, T extends PostMessagePageView | PostMessageTrackEvent<T>>({
  data: dataMsg
}: MessageEvent<PostMessage<D, T>>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoStartTimer':
      await startTimer();
      return;
    case 'junoStopTimer':
      stopTimer();
      return;
    case 'junoTrackPageView':
      await trackPageView(data as PostMessagePageView);
      return;
    case 'junoTrackEvent':
      await trackPageEvent(data as PostMessageTrackEvent<T>);
      return;
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

  const execute = async () => await Promise.all([syncPageViews(), syncTrackEvents()]);

  // We starts now but also schedule the update after wards
  await execute();

  // TODO: 1000 should be a parameter
  timer = setInterval(execute, 1000);
};

let syncViewsInProgress = false;
let syncEventsInProgress = false;

const syncPageViews = async () => {
  // One batch at a time to avoid to process multiple times the same entries
  if (syncViewsInProgress) {
    return;
  }

  const entries = await getPageViews();

  if (isNullish(entries) || entries.length === 0) {
    // Nothing to do
    return;
  }

  syncViewsInProgress = true;

  // TODO: persist pages views
  console.log(entries);

  await delPageViews(entries.map(([key, _]) => key));

  syncViewsInProgress = false;
};

// TODO: should we duplicate the function for views or events?
const syncTrackEvents = async () => {
  // One batch at a time to avoid to process multiple times the same entries
  if (syncEventsInProgress) {
    return;
  }

  const entries = await getTrackEvents();

  if (isNullish(entries) || entries.length === 0) {
    // Nothing to do
    return;
  }

  syncEventsInProgress = true;

  // TODO: persist pages views
  console.log(entries);

  await delTrackEvents(entries.map(([key, _]) => key));

  syncEventsInProgress = false;
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

const trackPageEvent = async <T>(track: PostMessageTrackEvent<T>) => {
  console.log(await toArray<T>(track.data));

  await setTrackEvent(track);
};
