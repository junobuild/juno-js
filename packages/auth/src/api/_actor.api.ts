import {
  type ConsoleActor,
  type SatelliteActor,
  getConsoleActor,
  getSatelliteActor
} from '@junobuild/ic-client/actor';
import {ActorParameters} from '../types/actor';

export const getAuthActor = ({
  auth,
  identity
}: ActorParameters): Promise<ConsoleActor | SatelliteActor> =>
  'satellite' in auth
    ? getSatelliteActor({...auth.satellite, identity})
    : getConsoleActor({...auth.console, identity});
