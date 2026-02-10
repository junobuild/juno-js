import type {Identity} from '@icp-sdk/core/agent';
import type {ConsoleDid, SatelliteDid} from '@junobuild/ic-client/actor';
import type {AuthParameters} from './authenticate';

export interface ActorParameters {
  auth: AuthParameters;
  identity: Identity;
}

export type AuthenticationArgs = SatelliteDid.AuthenticationArgs | ConsoleDid.AuthenticationArgs;
export type GetDelegationArgs = SatelliteDid.GetDelegationArgs | ConsoleDid.GetDelegationArgs;
export type AuthenticationResult = SatelliteDid.AuthenticateResultResponse | ConsoleDid.Result;
export type GetDelegationResult = SatelliteDid.GetDelegationResultResponse | ConsoleDid.Result_1;
export type SignedDelegation = SatelliteDid.SignedDelegation | ConsoleDid.SignedDelegation;
export type AuthenticationData<T extends AuthParameters> = T extends {satellite: unknown}
  ? Pick<SatelliteDid.Authentication, 'doc'>
  : Pick<ConsoleDid.Authentication, 'account'>;
