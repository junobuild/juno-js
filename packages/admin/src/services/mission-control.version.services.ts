import {version} from '../api/mission-control.api';
import type {MissionControlParameters} from '../types/actor.types';

/**
 * Retrieves the version of Mission Control.
 * @param {Object} params - The parameters for Mission Control.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @returns {Promise<string>} A promise that resolves to the version of Mission Control.
 */
export const missionControlVersion = (params: {
  missionControl: MissionControlParameters;
}): Promise<string> => version(params);
