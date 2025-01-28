import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {isNullish} from '@dfinity/utils';
import {
  listControllers,
  listDeprecatedControllers,
  listDeprecatedNoScopeControllers
} from '../api/satellite.api';
import {INSTALL_MODE_RESET, INSTALL_MODE_UPGRADE} from '../constants/upgrade.constants';
import {upgrade} from '../handlers/upgrade.handlers';
import type {SatelliteParameters} from '../types/actor.types';
import {UpgradeCodeParams} from '../types/upgrade.types';
import {encodeIDLControllers} from '../utils/idl.utils';

/**
 * Upgrades a satellite with the provided WASM module.
 * @param {Object} params - The parameters for upgrading the satellite.
 * @param {SatelliteParameters} params.satellite - The satellite parameters, including the actor and satellite ID.
 * @param {Principal} [params.missionControlId] - Optional. The Mission Control ID to potentially store WASM chunks, enabling reuse across installations.
 * @param {Uint8Array} params.wasmModule - The WASM module to be installed during the upgrade.
 * @param {boolean} params.deprecated - Indicates whether the upgrade is deprecated.
 * @param {boolean} params.deprecatedNoScope - Indicates whether the upgrade is deprecated and has no scope.
 * @param {boolean} [params.reset=false] - Optional. Specifies whether to reset the satellite (reinstall) instead of performing an upgrade. Defaults to `false`.
 * @param {boolean} [params.preClearChunks] - Optional. Forces clearing existing chunks before uploading a chunked WASM module. Recommended if the WASM exceeds 2MB.
 * @param {boolean} [params.takeSnapshot=true] - Optional. Whether to take a snapshot before performing the upgrade. Defaults to true.
 * @param {function} [params.onProgress] - Optional. Callback function to track progress during the upgrade process.
 * @throws {Error} Will throw an error if the satellite parameters are invalid or missing required fields.
 * @returns {Promise<void>} Resolves when the upgrade process is complete.
 */
export const upgradeSatellite = async ({
  satellite,
  deprecated,
  deprecatedNoScope,
  reset = false,
  ...rest
}: {
  satellite: SatelliteParameters;
  deprecated: boolean;
  deprecatedNoScope: boolean;
  reset?: boolean;
} & Pick<
  UpgradeCodeParams,
  'wasmModule' | 'missionControlId' | 'preClearChunks' | 'takeSnapshot' | 'onProgress'
>): Promise<void> => {
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

    await upgrade({
      actor,
      canisterId: Principal.fromText(satelliteId),
      arg: new Uint8Array(arg),
      mode: reset ? INSTALL_MODE_RESET : INSTALL_MODE_UPGRADE,
      reset,
      ...rest
    });

    return;
  }

  const list = deprecatedNoScope ? listDeprecatedNoScopeControllers : listControllers;

  // We pass the controllers to the upgrade but, it's just for the state of the art because I don't want to call the install without passing args. The module's post_upgrade do not consider the init parameters.
  const controllers = await list({satellite});

  const arg = encodeIDLControllers(controllers);

  await upgrade({
    actor,
    canisterId: Principal.fromText(satelliteId),
    arg: new Uint8Array(arg),
    mode: reset ? INSTALL_MODE_RESET : INSTALL_MODE_UPGRADE,
    reset,
    ...rest
  });
};
