import {createStore, delMany, entries, set} from 'idb-keyval';
import type {IdbKeyKey, IdbKeySessionId, IdbPageView, IdbTrackEvent} from '../types/idb';

const viewsStore = createStore('juno-views', 'views');
const eventsStore = createStore('juno-events', 'events');

export const setPageView = ({
  key,
  sessionId,
  view
}: {
  view: IdbPageView;
  key: IdbKeyKey;
  sessionId: IdbKeySessionId;
}): Promise<void> => set([key, sessionId], view, viewsStore);

export const getPageViews = (): Promise<[IDBValidKey, IdbPageView][]> => entries(viewsStore);

export const delPageViews = (keys: IDBValidKey[]): Promise<void> => delMany(keys, viewsStore);

export const setTrackEvent = ({
  key,
  sessionId,
  track
}: {
  key: IdbKeyKey;
  sessionId: IdbKeySessionId;
  track: IdbTrackEvent;
}): Promise<void> => set([key, sessionId], track, eventsStore);

export const getTrackEvents = (): Promise<[IDBValidKey, IdbTrackEvent][]> => entries(eventsStore);

export const delTrackEvents = (keys: IDBValidKey[]): Promise<void> => delMany(keys, eventsStore);
