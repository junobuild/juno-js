import type {IDL} from '@dfinity/candid';
import type {_SERVICE as IndexActor} from '../../declarations/index/index.did';
import {idlFactory as idlFactoryIndex} from '../../declarations/index/index.factory.did.js';
import type {ActorParameters, IndexParameters} from '../types/actor.types';
import {createActor} from '../utils/actor.utils';

export const getIndexActor = async ({indexId, ...rest}: IndexParameters): Promise<IndexActor> =>
  getActor({
    canisterId: indexId,
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
  if (!canisterId) {
    throw new Error('No canister ID provided.');
  }

  return createActor({
    canisterId,
    idlFactory,
    ...rest
  });
};
