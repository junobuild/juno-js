import {createStore, delMany, entries, set} from 'idb-keyval';
import {nanoid} from 'nanoid';
import {PageView, TrackEvent} from '../types/track';

const viewsStore = createStore('juno-views', 'views');
const eventsStore = createStore('juno-events', 'events');

export const setPageView = (view: PageView): Promise<void> => set(nanoid(), view, viewsStore);

export const getPageViews = (): Promise<[IDBValidKey, PageView][]> => entries(viewsStore);

export const delPageViews = (keys: IDBValidKey[]): Promise<void> => delMany(keys, viewsStore);

export const setTrackEvent = <T>(track: TrackEvent<T>): Promise<void> => set(nanoid(), track, eventsStore);

export const getTrackEvents = <T>(): Promise<[IDBValidKey, TrackEvent<T>][]> => entries(eventsStore);

export const delTrackEvents = (keys: IDBValidKey[]): Promise<void> => delMany(keys, eventsStore);
