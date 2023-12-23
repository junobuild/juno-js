import {
  deleteDoc as deleteDocApi,
  deleteManyDocs as deleteManyDocsApi,
  getDoc as getDocApi,
  getManyDocs as getManyDocsApi,
  listDocs as listDocsApi,
  setDoc as setDocApi,
  setManyDocs as setManyDocsApi
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

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getManyDocs = async ({
  satellite,
  ...rest
}: {
  docs: ({collection: string} & Pick<Doc<any>, 'key'>)[];
  satellite?: SatelliteOptions;
}): Promise<(Doc<any> | undefined)[]> => {
  const identity = getIdentity(satellite?.identity);

  return getManyDocsApi({...rest, satellite: {...satellite, identity}});
};
/* eslint-enable */

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

/* eslint-disable @typescript-eslint/no-explicit-any */
export const setManyDocs = async ({
  satellite,
  ...rest
}: {
  docs: {collection: string; doc: Doc<any>}[];
  satellite?: SatelliteOptions;
}): Promise<Doc<any>[]> => {
  const identity = getIdentity(satellite?.identity);

  return setManyDocsApi({...rest, satellite: {...satellite, identity}});
};
/* eslint-enable */

export const deleteDoc = async <D>({
  satellite,
  ...rest
}: {
  collection: string;
  doc: Doc<D>;
  satellite?: SatelliteOptions;
}): Promise<void> => {
  const identity = getIdentity(satellite?.identity);

  return deleteDocApi({...rest, satellite: {...satellite, identity}});
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteManyDocs = async ({
  satellite,
  ...rest
}: {
  docs: {collection: string; doc: Doc<any>}[];
  satellite?: SatelliteOptions;
}): Promise<void> => {
  const identity = getIdentity(satellite?.identity);

  return deleteManyDocsApi({...rest, satellite: {...satellite, identity}});
};
/* eslint-enable */

export const listDocs = async <D>({
  satellite,
  filter,
  ...rest
}: {
  collection: string;
  filter?: ListParams;
  satellite?: SatelliteOptions;
}): Promise<ListResults<Doc<D>>> => {
  const identity = getIdentity(satellite?.identity);

  return listDocsApi<D>({...rest, filter: filter ?? {}, satellite: {...satellite, identity}});
};
