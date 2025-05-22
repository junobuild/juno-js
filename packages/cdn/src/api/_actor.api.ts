import type {IDL} from '@dfinity/candid';
import type {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@dfinity/utils';
import type {_SERVICE as ConsoleActor} from '../../declarations/console/console.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryConsole} from '../../declarations/console/console.factory.did.js';
import type {_SERVICE as MissionControlActor} from '../../declarations/mission_control/mission_control.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory as idlFactoryMissionControl} from '../../declarations/mission_control/mission_control.factory.did.js';
import type {
  ActorParameters,
  CdnParameters,
  ConsoleParameters,
  MissionControlParameters
} from '../types/actor.params';
import {createActor} from '../utils/actor.utils';

export const getCdnActor = (cdn: CdnParameters): Promise<ConsoleActor | MissionControlActor> =>
  'missionControl' in cdn
    ? getMissionControlActor(cdn.missionControl)
    : getConsoleActor(cdn.console);

const getConsoleActor = ({consoleId, ...rest}: ConsoleParameters): Promise<ConsoleActor> =>
  getActor({
    canisterId: consoleId,
    ...rest,
    idlFactory: idlFactoryConsole
  });

const getMissionControlActor = ({
  missionControlId,
  ...rest
}: MissionControlParameters): Promise<MissionControlActor> =>
  getActor({
    canisterId: missionControlId,
    ...rest,
    idlFactory: idlFactoryMissionControl
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
