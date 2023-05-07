import {Doc} from '../../declarations/satellite/satellite.did';
import {fromArray} from './did.utils';

export const mapData = async <D>({data}: Pick<Doc, 'data'>): Promise<D> => {
  try {
    return await fromArray<D>(data);
  } catch (err: unknown) {
    console.error('The data parsing has failed, mapping to undefined as a fallback.', err);
    return undefined as D;
  }
};
