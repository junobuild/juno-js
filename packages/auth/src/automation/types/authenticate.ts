import type {SatelliteParameters} from '@junobuild/ic-client/actor';
import type {Nonce} from '../../types/nonce';
import type {AutomationData} from './actor';

export type AutomationGenerateJwtFn = (params: {nonce: Nonce}) => Promise<{jwt: string}>;

export interface AutomationCredentials {
  generateJwt: AutomationGenerateJwtFn;
}

export interface AutomationParams<T extends AutomationParameters = AutomationParameters> {
  github: {credentials: AutomationCredentials; automation: T};
}

/**
 * Represents initialization parameters for a Satellite actor.
 */
export interface AutomationParameters {
  satellite: Omit<SatelliteParameters, 'satelliteId' | 'identity'> &
    Required<Pick<SatelliteParameters, 'satelliteId'>>;
}

export type AuthenticatedAutomation = AutomationData;
