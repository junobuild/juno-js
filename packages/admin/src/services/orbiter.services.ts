import {Principal} from '@dfinity/principal';
import {upgradeCode} from '../api/ic.api';
import {listControllers, version} from '../api/orbiter.api';
import type {OrbiterParameters} from '../types/actor.types';
import {encodeIDLControllers} from '../utils/idl.utils';

export const orbiterVersion = async (params: {orbiter: OrbiterParameters}): Promise<string> =>
  version(params);

export const upgradeOrbiter = async ({
  orbiter,
  wasm_module
}: {
  orbiter: OrbiterParameters;
  wasm_module: Uint8Array;
}) => {
  const {orbiterId, ...actor} = orbiter;

  if (!orbiterId) {
    throw new Error('No orbiter principal defined.');
  }

  const controllers = await listControllers({orbiter});

  const arg = encodeIDLControllers(controllers);

  await upgradeCode({
    actor,
    code: {
      canister_id: Principal.fromText(orbiterId),
      arg: new Uint8Array(arg),
      wasm_module
    }
  });
};
