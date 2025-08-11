import {fromNullable, isNullish, nonNullish} from '@dfinity/utils';
import type {SatelliteDid} from '@junobuild/ic-client';
import type {ActorReadParams, ActorUpdateParams} from '../types/actor';
import type {Doc} from '../types/doc';
import type {ListParams, ListResults} from '../types/list';
import type {ExcludeDate} from '../types/utility';
import {mapData} from '../utils/data.utils';
import {fromDoc, toDelDoc, toSetDoc} from '../utils/doc.utils';
import {toListParams} from '../utils/list.utils';
import {getSatelliteActor} from './actor.api';

export const getDoc = async <D>({
  collection,
  key,
  ...rest
}: {
  collection: string;
} & ActorReadParams &
  Pick<Doc<D>, 'key'>): Promise<Doc<D> | undefined> => {
  const {get_doc} = await getSatelliteActor(rest);

  const doc = fromNullable(await get_doc(collection, key));

  if (isNullish(doc)) {
    return undefined;
  }

  return fromDoc({doc, key});
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getManyDocs = async ({
  docs,
  ...rest
}: {
  docs: ({collection: string} & Pick<Doc<any>, 'key'>)[];
} & ActorReadParams): Promise<(Doc<any> | undefined)[]> => {
  const {get_many_docs} = await getSatelliteActor(rest);

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
  ...rest
}: {
  collection: string;
  doc: Doc<D>;
} & ActorUpdateParams): Promise<Doc<D>> => {
  const {set_doc} = await getSatelliteActor(rest);

  const {key} = doc;

  const setDoc = await toSetDoc(doc);

  const updatedDoc = await set_doc(collection, key, setDoc);

  return await fromDoc({key, doc: updatedDoc});
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const setManyDocs = async ({
  docs,
  ...rest
}: {
  docs: {collection: string; doc: Doc<any>}[];
} & ActorUpdateParams): Promise<Doc<any>[]> => {
  const {set_many_docs} = await getSatelliteActor(rest);

  const payload: [string, string, SatelliteDid.SetDoc][] = [];
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
  ...rest
}: {
  collection: string;
  doc: Doc<D>;
} & ActorUpdateParams): Promise<void> => {
  const {del_doc} = await getSatelliteActor(rest);

  const {key} = doc;

  return del_doc(collection, key, toDelDoc(doc));
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteManyDocs = async ({
  docs,
  ...rest
}: {
  docs: {collection: string; doc: Doc<any>}[];
} & ActorUpdateParams): Promise<void> => {
  const {del_many_docs} = await getSatelliteActor(rest);

  const payload: [string, string, SatelliteDid.DelDoc][] = docs.map(({collection, doc}) => [
    collection,
    doc.key,
    toDelDoc(doc)
  ]);

  await del_many_docs(payload);
};
/* eslint-enable */

export const deleteFilteredDocs = async ({
  collection,
  filter,
  ...rest
}: {
  collection: string;
  filter: ListParams;
} & ActorUpdateParams): Promise<void> => {
  const {del_filtered_docs} = await getSatelliteActor(rest);

  return del_filtered_docs(collection, toListParams(filter));
};

export const listDocs = async <D>({
  collection,
  filter,
  ...rest
}: {
  collection: string;
  filter: ListParams;
} & ActorReadParams): Promise<ListResults<Doc<D>>> => {
  const {list_docs} = await getSatelliteActor(rest);

  const {items, items_page, items_length, matches_length, matches_pages} = await list_docs(
    collection,
    toListParams(filter)
  );

  const docs: Doc<D>[] = [];

  for (const [key, item] of items) {
    const {data: dataArray, owner, description, version, ...rest} = item;

    docs.push({
      key,
      description: fromNullable(description),
      owner: owner.toText(),
      data: await mapData<ExcludeDate<D>>({data: dataArray}),
      version: fromNullable(version),
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

export const countDocs = async ({
  collection,
  filter,
  ...rest
}: {
  collection: string;
  filter: ListParams;
} & ActorReadParams): Promise<bigint> => {
  const {count_docs} = await getSatelliteActor(rest);

  return count_docs(collection, toListParams(filter));
};
