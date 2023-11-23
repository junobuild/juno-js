import {fromNullable, isNullish} from '@junobuild/utils';
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

  const entry: DocApi | undefined = fromNullable(await actor.get_doc(collection, key));

  if (isNullish(entry)) {
    return undefined;
  }

  const {data: dataArray, owner, description, ...rest} = entry;

  const data: D = await mapData<D>({data: dataArray});

  return {
    key,
    description: fromNullable(description),
    owner: owner.toText(),
    data,
    ...rest
  };
};

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

  return await fromDoc({key, updatedDoc});
};

export const setManyDocs = async <D>({
  docs,
  satellite
}: {
  docs: {collection: string; doc: Doc<D>}[];
  satellite: Satellite;
}): Promise<Doc<D>[]> => {
  const {set_many_docs} = await getSatelliteActor(satellite);

  const payload: [string, string, SetDoc][] = [];
  for (const {collection, doc} of docs) {
    const {key} = doc;
    payload.push([collection, key, await toSetDoc(doc)]);
  }

  const updatedDocs = await set_many_docs(payload);

  const results: Doc<D>[] = [];
  for (const [key, updatedDoc] of updatedDocs) {
    results.push(await fromDoc({key, updatedDoc}));
  }

  return results;
};

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

export const deleteDocs = async ({
  collection,
  satellite
}: {
  collection: string;
  satellite: Satellite;
}): Promise<void> => {
  const {del_docs} = await getSatelliteActor(satellite);

  return del_docs(collection);
};

export const deleteManyDocs = async <D>({
  docs,
  satellite
}: {
  docs: {collection: string; doc: Doc<D>}[];
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
