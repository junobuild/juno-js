import {createStore, delMany, entries, set} from 'idb-keyval';
import {nanoid} from 'nanoid';
import {PageView} from '../types/track';

const viewsStore = createStore('juno-views', 'views');

export const setPageView = (view: PageView): Promise<void> => set(nanoid(), view, viewsStore);

export const getPageViews = (): Promise<[IDBValidKey, PageView][]> => entries(viewsStore);

export const delPageViews = (keys: IDBValidKey[]): Promise<void> => delMany(keys, viewsStore);
