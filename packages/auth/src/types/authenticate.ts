import type {DelegationChain, DelegationIdentity, ECDSAKeyIdentity} from '@icp-sdk/core/identity';
import type {ConsoleParameters, SatelliteParameters} from '@junobuild/ic-client/actor';
import type {AuthenticationData} from './actor';

export interface AuthenticationCredentials {
  jwt: string;
}

export type AuthenticationParams<T extends AuthParameters = AuthParameters> =
  | {redirect: null; auth: T}
  | {credentials: AuthenticationCredentials; auth: T};

export interface AuthenticatedIdentity {
  identity: DelegationIdentity;
  delegationChain: DelegationChain;
  sessionKey: ECDSAKeyIdentity;
}

/**
 * Represents initialization parameters for either a Console or Satellite actor.
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

export interface AuthenticatedSession<T extends AuthParameters> {
  identity: AuthenticatedIdentity;
  data: AuthenticationData<T>;
}
