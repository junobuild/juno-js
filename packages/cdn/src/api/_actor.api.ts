import {
  type ConsoleActor,
  type SatelliteActor,
  getConsoleActor,
  getSatelliteActor
} from '@junobuild/ic-client/actor';
import type {CdnParameters} from '../types/actor.params';

export const getCdnActor = (cdn: CdnParameters): Promise<ConsoleActor | SatelliteActor> =>
  'satellite' in cdn ? getSatelliteActor(cdn.satellite) : getConsoleActor(cdn.console);
