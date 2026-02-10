import type {SatelliteParameters} from '@junobuild/ic-client/actor';
import type {AutomationGitHubCredentials} from '../providers/github/types/authenticate';

export interface AutomationParams<T extends AutomationParameters = AutomationParameters> {
  github: {credentials: AutomationGitHubCredentials; automation: T};
}

/**
 * Represents initialization parameters for a Satellite actor.
 */
export interface AutomationParameters {
  satellite: Omit<SatelliteParameters, 'satelliteId' | 'identity'> &
    Required<Pick<SatelliteParameters, 'satelliteId'>>;
}
