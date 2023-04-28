import {
  delDoc as delDocApi,
  getDoc as getDocApi,
  listDocs as listDocsApi,
  setDoc as setDocApi
} from '../api/doc.api';
import type {Doc} from '../types/doc.types';
import type {ListParams, ListResults} from '../types/list.types';
import type {SatelliteOptions} from '../types/satellite.types';
import {getIdentity} from './identity.services';

export const getDoc = async <D>({
  satellite,
  ...rest
}: {
  collection: string;
  satellite?: SatelliteOptions;
} & Pick<Doc<D>, 'key'>): Promise<Doc<D> | undefined> => {
  const identity = getIdentity(satellite?.identity);

  return getDocApi({...rest, satellite: {...satellite, identity}});
};

export const setDoc = async <D>({
  satellite,
  ...rest
}: {
  collection: string;
  doc: Doc<D>;
  satellite?: SatelliteOptions;
}): Promise<Doc<D>> => {
  const identity = getIdentity(satellite?.identity);

  return setDocApi({...rest, satellite: {...satellite, identity}});
};

export const delDoc = async <D>({
  satellite,
  ...rest
}: {
  collection: string;
  doc: Doc<D>;
  satellite?: SatelliteOptions;
}): Promise<void> => {
  const identity = getIdentity(satellite?.identity);

  return delDocApi({...rest, satellite: {...satellite, identity}});
};

export const listDocs = async <D>({
  satellite,
  ...rest
}: {
  collection: string;
  filter: ListParams;
  satellite?: SatelliteOptions;
}): Promise<ListResults<Doc<D>>> => {
  const identity = getIdentity(satellite?.identity);

  return listDocsApi<D>({...rest, satellite: {...satellite, identity}});
};
