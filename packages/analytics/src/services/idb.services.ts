import {createStore, set} from 'idb-keyval';
import {nanoid} from 'nanoid';
import {PageView} from '../types/track';

const viewsStore = createStore('juno-views', 'views');

export const setPageView = async (view: PageView) => set(nanoid(), view, viewsStore);
