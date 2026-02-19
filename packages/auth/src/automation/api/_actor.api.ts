import {type SatelliteActor, getSatelliteActor} from '@junobuild/ic-client/actor';
import type {ActorParameters} from '../types/actor';

export const getAutomationActor = ({
  automation,
  identity
}: ActorParameters): Promise<SatelliteActor> =>
  getSatelliteActor({...automation.satellite, identity});
