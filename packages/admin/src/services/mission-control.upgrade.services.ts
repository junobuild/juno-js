import {type MissionControlParameters, toPrincipal} from '@junobuild/ic-client';
import {getUser} from '../api/mission-control.api';
import {INSTALL_MODE_UPGRADE} from '../constants/upgrade.constants';
import {upgrade} from '../handlers/upgrade.handlers';
import type {UpgradeCodeParams} from '../types/upgrade';
import {encoreIDLUser} from '../utils/idl.utils';

/**
 * Upgrades the Mission Control with the provided WASM module.
 * @param {Object} params - The parameters for upgrading the Mission Control.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters, including the actor and mission control ID.
 * @param {Uint8Array} params.wasmModule - The WASM module to be installed during the upgrade.
 * @param {boolean} [params.preClearChunks] - Optional. Whether to force clearing chunks before uploading a chunked WASM module. Recommended if the WASM exceeds 2MB.
 * @param {boolean} [params.takeSnapshot=true] - Optional. Whether to take a snapshot before performing the upgrade. Defaults to true.
 * @param {function} [params.onProgress] - Optional. Callback function to report progress during the upgrade process.
 * @throws {Error} Will throw an error if the mission control principal is not defined.
 * @returns {Promise<void>} Resolves when the upgrade process is complete.
 */
export const upgradeMissionControl = async ({
  missionControl,
  ...rest
}: {
  missionControl: MissionControlParameters;
} & Pick<
  UpgradeCodeParams,
  'wasmModule' | 'preClearChunks' | 'takeSnapshot' | 'onProgress'
>): Promise<void> => {
  const user = await getUser({missionControl});

  const {missionControlId, ...actor} = missionControl;

  if (!missionControlId) {
    throw new Error('No mission control principal defined.');
  }

  const arg = encoreIDLUser(user);

  await upgrade({
    actor,
    canisterId: toPrincipal(missionControlId),
    arg: new Uint8Array(arg),
    mode: INSTALL_MODE_UPGRADE,
    ...rest
  });
};
