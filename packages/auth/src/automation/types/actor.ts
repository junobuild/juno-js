import type {Identity} from '@icp-sdk/core/agent';
import type {Principal} from '@icp-sdk/core/principal';
import type {SatelliteDid} from '@junobuild/ic-client/actor';
import type {AutomationParameters} from './authenticate';

export interface ActorParameters {
  automation: AutomationParameters;
  identity: Identity;
}

export type AutomationArgs = SatelliteDid.AuthenticateAutomationArgs;
export type AutomationResult = SatelliteDid.AuthenticateAutomationResultResponse;
export type AutomationData = [Principal, SatelliteDid.AutomationController];
