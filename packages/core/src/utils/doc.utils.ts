import {fromNullable, toNullable} from '@dfinity/utils';
import {fromArray, toArray} from '@junobuild/utils';
import type {DelDoc, Doc as DocApi, SetDoc} from '../../declarations/satellite/satellite.did';
import type {Doc} from '../types/doc';
import type {ExcludeDate} from '../types/utility';

export const toSetDoc = async <D>(doc: Doc<D>): Promise<SetDoc> => {
  const {data, version, description} = doc;

  return {
    description: toNullable(description),
    data: await toArray<ExcludeDate<D>>(data),
    version: toNullable(version)
  };
};

export const toDelDoc = <D>(doc: Doc<D>): DelDoc => {
  const {version} = doc;

  return {
    version: toNullable(version)
  };
};

export const fromDoc = async <D>({doc, key}: {doc: DocApi; key: string}): Promise<Doc<D>> => {
  const {owner, version, description: docDescription, data, ...rest} = doc;

  return {
    key,
    description: fromNullable(docDescription),
    owner: owner.toText(),
    data: await fromArray<ExcludeDate<D>>(data),
    version: fromNullable(version),
    ...rest
  };
};
