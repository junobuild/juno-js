import {Principal} from '@dfinity/principal';
import {isNullish} from '@junobuild/utils';
import {toNullable} from '@junobuild/utils';
import {nanoid} from 'nanoid';
import {getOrbiterActor} from '../api/actor.api';
import {
  delPageViews,
  delTrackEvents,
  getPageViews,
  getTrackEvents,
  setPageView,
  setTrackEvent
} from '../services/idb.services';
import type {PostMessage, PostMessagePageView, PostMessageTrackEvent} from '../types/post-message';
import {PostMessageStartTimer} from '../types/post-message';
import type {PageView} from '../types/track';
import {nowInBigIntNanoSeconds} from '../utils/date.utils';

onmessage = async <D, T extends PostMessagePageView | PostMessageTrackEvent<T>>({
  data: dataMsg
}: MessageEvent<PostMessage<D, T>>) => {
  const {msg, data} = dataMsg;

  switch (msg) {
    case 'junoStartTimer':
      await startTimer(data as PostMessageStartTimer);
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

const sessionId = nanoid();

const startTimer = async (env: PostMessageStartTimer) => {
  // Avoid re-starting the timer
  if (timer !== undefined) {
    return;
  }

  const execute = async () => await Promise.all([syncPageViews(env), syncTrackEvents(env)]);

  // We starts now but also schedule the update after wards
  await execute();

  // TODO: 1000 should be a parameter
  timer = setInterval(execute, 1000);
};

let syncViewsInProgress = false;
let syncEventsInProgress = false;

const syncPageViews = async (env: PostMessageStartTimer) => {
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
  console.log({sessionId}, entries);

  const actor = await getOrbiterActor(env);
  const promises = entries.map(
    ([
      key,
      {
        title,
        href,
        referrer,
        device: {innerWidth, innerHeight},
        userAgent,
        timeZone,
        collectedAt
      }
    ]) =>
      actor.set_page_view(
        {
          key: key as string,
          satellite_id: Principal.fromText(env.satelliteId)
        },
        {
          title,
          href,
          referrer: toNullable(referrer),
          device: {
            inner_width: innerWidth,
            inner_height: innerHeight
          },
          user_agent: toNullable(userAgent),
          time_zone: timeZone,
          collected_at: collectedAt,
          updated_at: []
        }
      )
  );
  const result = await Promise.allSettled(promises);
  // TODO: remove and handle errors
  console.log(result);

  await delPageViews(entries.map(([key, _]) => key));

  syncViewsInProgress = false;
};

// TODO: should we duplicate the function for views or events?
const syncTrackEvents = async (env: PostMessageStartTimer) => {
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
  console.log({sessionId}, entries);

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

  console.log({sessionId}, 'trackPageView');

  await setPageView(pageView);
};

const trackPageEvent = async <T>(track: PostMessageTrackEvent<T>) => {
  console.log({sessionId}, 'trackPageEvent');

  await setTrackEvent(track);
};