import {createStore, delMany, entries, set} from 'idb-keyval';
import {nanoid} from 'nanoid';
import {SetPageView, SetTrackEvent} from '../../declarations/orbiter/orbiter.did';

const viewsStore = createStore('juno-views', 'views');
const eventsStore = createStore('juno-events', 'events');

export const setPageView = (view: SetPageView): Promise<void> => set(nanoid(), view, viewsStore);

export const getPageViews = (): Promise<[IDBValidKey, SetPageView][]> => entries(viewsStore);

export const delPageViews = (keys: IDBValidKey[]): Promise<void> => delMany(keys, viewsStore);

export const setTrackEvent = <T>(track: SetTrackEvent): Promise<void> =>
  set(nanoid(), track, eventsStore);

export const getTrackEvents = <T>(): Promise<[IDBValidKey, SetTrackEvent][]> =>
  entries(eventsStore);

export const delTrackEvents = (keys: IDBValidKey[]): Promise<void> => delMany(keys, eventsStore);
