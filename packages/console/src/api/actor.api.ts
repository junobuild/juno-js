import type {IDL} from '@dfinity/candid';
import {isNullish} from '@junobuild/utils';
import type {_SERVICE as ConsoleActor} from '../../declarations/console/console.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryConsole} from '../../declarations/console/console.factory.did.js';
import type {ActorParameters, ConsoleParameters} from '../types/actor.types';
import {createActor} from '../utils/actor.utils';

export const getConsoleActor = ({
  consoleId,
  ...rest
}: ConsoleParameters): Promise<ConsoleActor> =>
  getActor({
    canisterId: consoleId,
    ...rest,
    idlFactory: idlFactoryConsole
  });

export const getActor = <T>({
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
