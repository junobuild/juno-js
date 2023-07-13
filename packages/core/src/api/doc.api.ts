import {fromNullable, isNullish, toArray, toNullable} from '@junobuild/utils';
import type {
  Doc as DocApi,
  ListResults_1 as ListDocsApi,
  _SERVICE as SatelliteActor
} from '../../declarations/satellite/satellite.did';
import type {Doc} from '../types/doc.types';
import type {ListParams, ListResults} from '../types/list.types';
import type {Satellite} from '../types/satellite.types';
import {mapData} from '../utils/data.utils';
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
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  const {key, data, updated_at, description} = doc;

  const updatedDoc: DocApi = await actor.set_doc(collection, key, {
    description: toNullable(description),
    data: await toArray<D>(data),
    updated_at: toNullable(updated_at)
  });

  const {owner, updated_at: updatedAt, created_at, description: updatedDescription} = updatedDoc;

  // We update the data with the updated_at timestamp generated in the backend.
  // The canister checks if the updated_at date is equals to the entity timestamp otherwise it rejects the update to prevent overwrite of data if user uses multiple devices.
  // In other words: to update a data, the current updated_at information need to be provided.
  return {
    key,
    description: fromNullable(updatedDescription),
    owner: owner.toText(),
    data,
    created_at,
    updated_at: updatedAt
  };
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
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  const {key, updated_at} = doc;

  return actor.del_doc(collection, key, {
    updated_at: toNullable(updated_at)
  });
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
