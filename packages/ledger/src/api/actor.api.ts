import type {IDL} from '@dfinity/candid';
import {isNullish} from '@dfinity/utils';
import type {_SERVICE as IndexActor} from '../../declarations/index/index.did';
import {idlFactory as idlFactoryIndex} from '../../declarations/index/index.factory.did.js';
import {ICP_INDEX_CANISTER_ID} from '../constants/index.constants';
import type {ActorParameters, IndexParameters} from '../types/actor.types';
import {createActor} from '../utils/actor.utils';

export const getIndexActor = async ({indexId, ...rest}: IndexParameters): Promise<IndexActor> =>
  getActor({
    canisterId: indexId ?? ICP_INDEX_CANISTER_ID,
    ...rest,
    idlFactory: idlFactoryIndex
  });

const getActor = async <T>({
  canisterId,
  idlFactory,
  ...rest
}: ActorParameters & {
  canisterId: string | undefined;
  idlFactory: IDL.InterfaceFactory;
}): Promise<T> => {
  if (isNullish(canisterId)) {
    throw new Error('No canister ID provided.');
  }

  return createActor({
    canisterId,
    idlFactory,
    ...rest
  });
};
