import {fromArray, fromNullable, toArray, toNullable} from '@junobuild/utils';
import type {DelDoc, Doc as DocApi, SetDoc} from '../../declarations/satellite/satellite.did';
import type {Doc} from '../types/doc.types';

export const toSetDoc = async <D>(doc: Doc<D>): Promise<SetDoc> => {
  const {data, updated_at, description} = doc;

  return {
    description: toNullable(description),
    data: await toArray<D>(data),
    updated_at: toNullable(updated_at)
  };
};

export const toDelDoc = <D>(doc: Doc<D>): DelDoc => {
  const {updated_at} = doc;

  return {
    updated_at: toNullable(updated_at)
  };
};

export const fromDoc = async <D>({
  updatedDoc,
  key
}: {
  updatedDoc: DocApi;
  key: string;
}): Promise<Doc<D>> => {
  const {
    owner,
    updated_at: updatedAt,
    created_at,
    description: updatedDescription,
    data
  } = updatedDoc;

  // We update the data with the updated_at timestamp generated in the backend.
  // The canister checks if the updated_at date is equals to the entity timestamp otherwise it rejects the update to prevent overwrite of data if user uses multiple devices.
  // In other words: to update a data, the current updated_at information need to be provided.
  return {
    key,
    description: fromNullable(updatedDescription),
    owner: owner.toText(),
    data: await fromArray<D>(data),
    created_at,
    updated_at: updatedAt
  };
};
