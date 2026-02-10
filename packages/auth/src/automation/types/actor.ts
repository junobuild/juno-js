import type {Identity} from '@icp-sdk/core/agent';
import type {SatelliteDid} from '@junobuild/ic-client/actor';
import type {AutomationParameters} from './authenticate';

export interface ActorParameters {
  automation: AutomationParameters;
  identity: Identity;
}

export type AutomationArgs = SatelliteDid.AuthenticateAutomationArgs;
export type AutomationResult = SatelliteDid.AuthenticateAutomationResultResponse;
