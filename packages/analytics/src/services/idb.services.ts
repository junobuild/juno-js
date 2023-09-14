import {createStore, delMany, entries, set} from 'idb-keyval';
import type {IdbKey, IdbPageView, IdbTrackEvent} from '../types/idb';

const viewsStore = createStore('juno-views', 'views');
const eventsStore = createStore('juno-events', 'events');

export const setPageView = ({key, view}: {key: IdbKey; view: IdbPageView}): Promise<void> =>
  set(key, view, viewsStore);

export const getPageViews = (): Promise<[IDBValidKey, IdbPageView][]> => entries(viewsStore);

export const delPageViews = (keys: IDBValidKey[]): Promise<void> => delMany(keys, viewsStore);

export const setTrackEvent = ({key, track}: {key: IdbKey; track: IdbTrackEvent}): Promise<void> =>
  set(key, track, eventsStore);

export const getTrackEvents = (): Promise<[IDBValidKey, IdbTrackEvent][]> => entries(eventsStore);

export const delTrackEvents = (keys: IDBValidKey[]): Promise<void> => delMany(keys, eventsStore);
