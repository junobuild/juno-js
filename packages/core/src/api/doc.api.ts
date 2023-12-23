import {fromNullable, isNullish, nonNullish} from '@junobuild/utils';
import type {
  DelDoc,
  Doc as DocApi,
  ListResults_1 as ListDocsApi,
  _SERVICE as SatelliteActor,
  SetDoc
} from '../../declarations/satellite/satellite.did';
import type {Doc} from '../types/doc.types';
import type {ListParams, ListResults} from '../types/list.types';
import type {Satellite} from '../types/satellite.types';
import {mapData} from '../utils/data.utils';
import {fromDoc, toDelDoc, toSetDoc} from '../utils/doc.utils';
import {toListParams} from '../utils/list.utils';
import {getSatelliteActor} from './actor.api';

export const getDoc = async <D>({
  collection,
  key,
  satellite
}: {
  collection: string;
  satellite: Satellite;
} & Pick<Doc<D>, 'key'>): Promise<Doc<D> | undefined> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  const doc: DocApi | undefined = fromNullable(await actor.get_doc(collection, key));

  if (isNullish(doc)) {
    return undefined;
  }

  return fromDoc({doc, key});
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getManyDocs = async ({
  docs,
  satellite
}: {
  docs: ({collection: string} & Pick<Doc<any>, 'key'>)[];
  satellite: Satellite;
}): Promise<(Doc<any> | undefined)[]> => {
  const {get_many_docs} = await getSatelliteActor(satellite);

  const payload: [string, string][] = docs.map(({collection, key}) => [collection, key]);

  const resultsDocs = await get_many_docs(payload);

  const results: (Doc<any> | undefined)[] = [];
  for (const [key, resultDoc] of resultsDocs) {
    const doc = fromNullable(resultDoc);
    results.push(nonNullish(doc) ? await fromDoc({key, doc}) : undefined);
  }

  return results;
};
/* eslint-enable */

export const setDoc = async <D>({
  collection,
  doc,
  satellite
}: {
  collection: string;
  doc: Doc<D>;
  satellite: Satellite;
}): Promise<Doc<D>> => {
  const {set_doc} = await getSatelliteActor(satellite);

  const {key} = doc;

  const setDoc = await toSetDoc(doc);

  const updatedDoc = await set_doc(collection, key, setDoc);

  return await fromDoc({key, doc: updatedDoc});
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const setManyDocs = async ({
  docs,
  satellite
}: {
  docs: {collection: string; doc: Doc<any>}[];
  satellite: Satellite;
}): Promise<Doc<any>[]> => {
  const {set_many_docs} = await getSatelliteActor(satellite);

  const payload: [string, string, SetDoc][] = [];
  for (const {collection, doc} of docs) {
    const {key} = doc;
    payload.push([collection, key, await toSetDoc(doc)]);
  }

  const updatedDocs = await set_many_docs(payload);

  const results: Doc<any>[] = [];
  for (const [key, updatedDoc] of updatedDocs) {
    results.push(await fromDoc({key, doc: updatedDoc}));
  }

  return results;
};
/* eslint-enable */

export const deleteDoc = async <D>({
  collection,
  doc,
  satellite
}: {
  collection: string;
  doc: Doc<D>;
  satellite: Satellite;
}): Promise<void> => {
  const {del_doc} = await getSatelliteActor(satellite);

  const {key} = doc;

  return del_doc(collection, key, toDelDoc(doc));
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteManyDocs = async ({
  docs,
  satellite
}: {
  docs: {collection: string; doc: Doc<any>}[];
  satellite: Satellite;
}): Promise<void> => {
  const {del_many_docs} = await getSatelliteActor(satellite);

  const payload: [string, string, DelDoc][] = docs.map(({collection, doc}) => [
    collection,
    doc.key,
    toDelDoc(doc)
  ]);

  await del_many_docs(payload);
};
/* eslint-enable */

export const listDocs = async <D>({
  collection,
  filter,
  satellite
}: {
  collection: string;
  filter: ListParams;
  satellite: Satellite;
}): Promise<ListResults<Doc<D>>> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  const {items, items_page, items_length, matches_length, matches_pages}: ListDocsApi =
    await actor.list_docs(collection, toListParams(filter));

  const docs: Doc<D>[] = [];

  for (const [key, item] of items) {
    const {data: dataArray, owner, description, ...rest} = item;

    docs.push({
      key,
      description: fromNullable(description),
      owner: owner.toText(),
      data: await mapData<D>({data: dataArray}),
      ...rest
    });
  }

  return {
    items: docs,
    items_length,
    items_page: fromNullable(items_page),
    matches_length,
    matches_pages: fromNullable(matches_pages)
  };
};
