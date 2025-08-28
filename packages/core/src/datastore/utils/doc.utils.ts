import {fromNullable, toNullable} from '@dfinity/utils';
import type {SatelliteDid} from '@junobuild/ic-client/actor';
import {fromArray, toArray} from '@junobuild/utils';
import type {ExcludeDate} from '../../core/types/utility';
import type {Doc} from '../types/doc';

export const toSetDoc = async <D>(doc: Doc<D>): Promise<SatelliteDid.SetDoc> => {
  const {data, version, description} = doc;

  return {
    description: toNullable(description),
    data: await toArray<ExcludeDate<D>>(data),
    version: toNullable(version)
  };
};

export const toDelDoc = <D>(doc: Doc<D>): SatelliteDid.DelDoc => {
  const {version} = doc;

  return {
    version: toNullable(version)
  };
};

export const fromDoc = async <D>({
  doc,
  key
}: {
  doc: SatelliteDid.Doc;
  key: string;
}): Promise<Doc<D>> => {
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
