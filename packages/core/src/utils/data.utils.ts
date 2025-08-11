import type {SatelliteDid} from '@junobuild/ic-client';
import {fromArray} from '@junobuild/utils';

export const mapData = async <D>({data}: Pick<SatelliteDid.Doc, 'data'>): Promise<D> => {
  try {
    return await fromArray<D>(data);
  } catch (err: unknown) {
    console.error('The data parsing has failed, mapping to undefined as a fallback.', err);
    return undefined as D;
  }
};
