import {
  type ConsoleActor,
  type SatelliteActor,
  getConsoleActor,
  getSatelliteActor
} from '@junobuild/ic-client/actor';
import {AuthParameters} from '../types/actor';

export const getAuthActor = (auth: AuthParameters): Promise<ConsoleActor | SatelliteActor> =>
  'satellite' in auth ? getSatelliteActor(auth.satellite) : getConsoleActor(auth.console);
