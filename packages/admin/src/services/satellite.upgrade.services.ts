import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {isNullish} from '@junobuild/utils';
import {upgradeCode} from '../api/ic.api';
import {
  listControllers,
  listDeprecatedControllers,
  listDeprecatedNoScopeControllers
} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor.types';
import {encodeIDLControllers} from '../utils/idl.utils';

/**
 * Upgrades the satellite with the provided WASM module.
 * @param {Object} params - The parameters for upgrading the satellite.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {Uint8Array} params.wasm_module - The WASM module for the upgrade.
 * @param {boolean} params.deprecated - Whether the upgrade is deprecated.
 * @param {boolean} params.deprecatedNoScope - Whether the upgrade is deprecated with no scope.
 * @param {boolean} [params.reset=false] - Whether to reset the satellite (reinstall) instead of upgrading.
 * @returns {Promise<void>} A promise that resolves when the upgrade is complete.
 */
export const upgradeSatellite = async ({
  satellite,
  wasm_module,
  deprecated,
  deprecatedNoScope,
  reset = false
}: {
  satellite: SatelliteParameters;
  wasm_module: Uint8Array;
  deprecated: boolean;
  deprecatedNoScope: boolean;
  reset?: boolean;
}): Promise<void> => {
  const {satelliteId, ...actor} = satellite;

  if (isNullish(satelliteId)) {
    throw new Error('No satellite principal defined.');
  }

  // TODO: remove agent-js "type mismatch: type on the wire principal"
  if (deprecated) {
    const controllers = await listDeprecatedControllers({satellite});

    const arg = IDL.encode(
      [
        IDL.Record({
          controllers: IDL.Vec(IDL.Principal)
        })
      ],
      [{controllers}]
    );

    await upgradeCode({
      actor,
      code: {
        canister_id: Principal.fromText(satelliteId),
        arg: new Uint8Array(arg),
        wasm_module,
        mode: reset
          ? {reinstall: null}
          : {upgrade: [{skip_pre_upgrade: [false], wasm_memory_persistence: [{replace: null}]}]}
      }
    });

    return;
  }

  const list = deprecatedNoScope ? listDeprecatedNoScopeControllers : listControllers;

  // We pass the controllers to the upgrade but, it's just for the state of the art because I don't want to call the install without passing args. The module's post_upgrade do not consider the init parameters.
  const controllers = await list({satellite});

  const arg = encodeIDLControllers(controllers);

  await upgradeCode({
    actor,
    code: {
      canister_id: Principal.fromText(satelliteId),
      arg: new Uint8Array(arg),
      wasm_module,
      mode: reset
        ? {reinstall: null}
        : {upgrade: [{skip_pre_upgrade: [false], wasm_memory_persistence: [{replace: null}]}]}
    }
  });
};
