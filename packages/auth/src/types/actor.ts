import type {Identity} from '@dfinity/agent';
import type {
  ConsoleDid,
  ConsoleParameters,
  SatelliteDid,
  SatelliteParameters
} from '@junobuild/ic-client/actor';

/**
 * Represents initialization parameters for either a Console or Satellite actor.
 * Use discriminated unions to pass the correct parameters depending on the authentication to target.
 */
export type AuthParameters =
  | {
      console: Omit<ConsoleParameters, 'consoleId' | 'identity'> &
        Required<Pick<ConsoleParameters, 'consoleId'>>;
    }
  | {
      satellite: Omit<SatelliteParameters, 'satelliteId' | 'identity'> &
        Required<Pick<SatelliteParameters, 'satelliteId'>>;
    };

export interface ActorParameters {
  auth: AuthParameters;
  identity: Identity;
}

export type AuthenticationArgs = SatelliteDid.AuthenticationArgs | ConsoleDid.AuthenticationArgs;
export type GetDelegationArgs = SatelliteDid.GetDelegationArgs | ConsoleDid.GetDelegationArgs;
export type AuthenticationResult = SatelliteDid.AuthenticateResultResponse | ConsoleDid.Result;
export type GetDelegationResult = SatelliteDid.GetDelegationResultResponse | ConsoleDid.Result_1;
export type SignedDelegation = SatelliteDid.SignedDelegation | ConsoleDid.SignedDelegation;
