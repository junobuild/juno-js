import type {ActorMethod, ActorSubclass} from '@icp-sdk/core/agent';
import type {IDL} from '@icp-sdk/core/candid';
import {assertNonNullish} from '@dfinity/utils';
import {
  idlCertifiedFactorySatellite,
  idlFactorySatellite,
  type SatelliteActor
} from '@junobuild/ic-client/actor';
import {ActorStore} from '../stores/actor.store';
import type {ActorKey} from '../types/actor';
import type {CallOptions} from '../types/call-options';
import type {SatelliteContext} from '../types/satellite';
import {customOrEnvContainer, customOrEnvSatelliteId} from '../utils/env.utils';

export const getSatelliteActor = ({
  satellite,
  options: {certified}
}: {
  satellite: SatelliteContext;
  options: CallOptions;
}): Promise<SatelliteActor> =>
  getActor({
    idlFactory: certified ? idlCertifiedFactorySatellite : idlFactorySatellite,
    actorKey: `stock#${certified ? 'update' : 'query'}`,
    ...satellite
  });

export const getSatelliteExtendedActor = <T = Record<string, ActorMethod>>({
  idlFactory,
  ...rest
}: SatelliteContext & {idlFactory: IDL.InterfaceFactory}): Promise<ActorSubclass<T>> =>
  getActor({
    idlFactory,
    actorKey: 'extended#query',
    ...rest
  });

const getActor = async <T = Record<string, ActorMethod>>({
  satelliteId: customSatelliteId,
  container: customContainer,
  ...rest
}: SatelliteContext & {idlFactory: IDL.InterfaceFactory; actorKey: ActorKey}): Promise<
  ActorSubclass<T>
> => {
  const {satelliteId} = customOrEnvSatelliteId({satelliteId: customSatelliteId});

  assertNonNullish(satelliteId, 'No satellite ID defined. Did you initialize Juno?');

  const {container} = customOrEnvContainer({container: customContainer});

  return await ActorStore.getInstance().getActor({
    satelliteId,
    container,
    ...rest
  });
};
