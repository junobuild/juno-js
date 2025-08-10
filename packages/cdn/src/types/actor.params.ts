import type {ConsoleParameters, SatelliteParameters} from '@junobuild/ic-client';

/**
 * Represents initialization parameters for either a Console or Satellite actor.
 * Use discriminated unions to pass the correct parameters depending on the CDN to target.
 */
export type CdnParameters =
  | {console: Omit<ConsoleParameters, 'consoleId'> & Required<Pick<ConsoleParameters, 'consoleId'>>}
  | {
      satellite: Omit<SatelliteParameters, 'satelliteId'> &
        Required<Pick<SatelliteParameters, 'satelliteId'>>;
    };
