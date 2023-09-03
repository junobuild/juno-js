import {createStore, delMany, entries, set} from 'idb-keyval';
import {nanoid} from 'nanoid';
import type {IdbPageView, IdbTrackEvent} from '../types/idb';

const viewsStore = createStore('juno-views', 'views');
const eventsStore = createStore('juno-events', 'events');

export const setPageView = (view: IdbPageView): Promise<void> => set(nanoid(), view, viewsStore);

export const getPageViews = (): Promise<[IDBValidKey, IdbPageView][]> => entries(viewsStore);

export const delPageViews = (keys: IDBValidKey[]): Promise<void> => delMany(keys, viewsStore);

export const setTrackEvent = (track: IdbTrackEvent): Promise<void> =>
  set(nanoid(), track, eventsStore);

export const getTrackEvents = (): Promise<[IDBValidKey, IdbTrackEvent][]> => entries(eventsStore);

export const delTrackEvents = (keys: IDBValidKey[]): Promise<void> => delMany(keys, eventsStore);
