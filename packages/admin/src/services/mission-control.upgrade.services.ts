import {Principal} from '@dfinity/principal';
import {getUser} from '../api/mission-control.api';
import {INSTALL_MODE_UPGRADE} from '../constants/upgrade.constants';
import {upgrade} from '../handlers/upgrade.handlers';
import type {MissionControlParameters} from '../types/actor.types';
import {encoreIDLUser} from '../utils/idl.utils';

/**
 * Upgrades the Mission Control with the provided WASM module.
 * @param {Object} params - The parameters for upgrading Mission Control.
 * @param {MissionControlParameters} params.missionControl - The Mission Control parameters.
 * @param {Uint8Array} params.wasm_module - The WASM module for the upgrade.
 * @throws Will throw an error if no mission control principal is defined.
 * @returns {Promise<void>} A promise that resolves when the upgrade is complete.
 */
export const upgradeMissionControl = async ({
  missionControl,
  wasmModule
}: {
  missionControl: MissionControlParameters;
  wasmModule: Uint8Array;
}): Promise<void> => {
  const user = await getUser({missionControl});

  const {missionControlId, ...actor} = missionControl;

  if (!missionControlId) {
    throw new Error('No mission control principal defined.');
  }

  const arg = encoreIDLUser(user);

  await upgrade({
    actor,
    canisterId: Principal.fromText(missionControlId),
    arg: new Uint8Array(arg),
    wasmModule,
    mode: INSTALL_MODE_UPGRADE
  });
};
