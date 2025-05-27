import type {IDL} from '@dfinity/candid';
import type {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@dfinity/utils';
import type {_SERVICE as ConsoleActor} from '../../declarations/console/console.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryConsole} from '../../declarations/console/console.factory.did.js';
import type {_SERVICE as SatelliteActor} from '../../declarations/satellite/satellite.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactorySatellite} from '../../declarations/satellite/satellite.factory.did.js';
import type {
  ActorParameters,
  CdnParameters,
  ConsoleParameters,
  SatelliteParameters
} from '../types/actor.params';
import {createActor} from '../utils/actor.utils';

export const getCdnActor = (cdn: CdnParameters): Promise<ConsoleActor | SatelliteActor> =>
  'satellite' in cdn ? getSatelliteActor(cdn.satellite) : getConsoleActor(cdn.console);

const getConsoleActor = ({consoleId, ...rest}: ConsoleParameters): Promise<ConsoleActor> =>
  getActor({
    canisterId: consoleId,
    ...rest,
    idlFactory: idlFactoryConsole
  });

const getSatelliteActor = ({satelliteId, ...rest}: SatelliteParameters): Promise<SatelliteActor> =>
  getActor({
    canisterId: satelliteId,
    ...rest,
    idlFactory: idlFactorySatellite
  });

const getActor = <T>({
  canisterId,
  idlFactory,
  ...rest
}: ActorParameters & {
  canisterId: string | Principal | undefined;
  idlFactory: IDL.InterfaceFactory;
}): Promise<T> => {
  assertNonNullish(canisterId, 'No canister ID provided.');

  return createActor({
    canisterId,
    idlFactory,
    ...rest
  });
};
