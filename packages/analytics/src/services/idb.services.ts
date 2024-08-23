import {createStore, delMany, entries, set} from 'idb-keyval';
import type {IdbKey, IdbPageView, IdbPerformanceMetric, IdbTrackEvent} from '../types/idb';

const viewsStore = createStore('juno-views', 'views');
const eventsStore = createStore('juno-events', 'events');
const metricsStore = createStore('juno-metrics', 'metrics');

export const setPageView = ({key, view}: {key: IdbKey; view: IdbPageView}): Promise<void> =>
  set(key, view, viewsStore);

export const getPageViews = (): Promise<[IDBValidKey, IdbPageView][]> => entries(viewsStore);

export const delPageViews = (keys: IDBValidKey[]): Promise<void> => delMany(keys, viewsStore);

export const setTrackEvent = ({key, track}: {key: IdbKey; track: IdbTrackEvent}): Promise<void> =>
  set(key, track, eventsStore);

export const getTrackEvents = (): Promise<[IDBValidKey, IdbTrackEvent][]> => entries(eventsStore);

export const delTrackEvents = (keys: IDBValidKey[]): Promise<void> => delMany(keys, eventsStore);

export const setPerformanceMetric = ({
  key,
  view
}: {
  key: IdbKey;
  view: IdbPerformanceMetric;
}): Promise<void> => set(key, view, metricsStore);

export const getPerformanceMetrics = (): Promise<[IDBValidKey, IdbPerformanceMetric][]> =>
  entries(metricsStore);

export const delPerformanceMetrics = (keys: IDBValidKey[]): Promise<void> =>
  delMany(keys, metricsStore);
