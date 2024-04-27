import {Principal} from '@dfinity/principal';
import type {Controller} from '../../declarations/mission_control/mission_control.did';
import type {MemorySize} from '../../declarations/orbiter/orbiter.did';
import {upgradeCode} from '../api/ic.api';
import {listControllers, memorySize, version} from '../api/orbiter.api';
import type {OrbiterParameters} from '../types/actor.types';
import {encodeIDLControllers} from '../utils/idl.utils';

export const orbiterVersion = async (params: {orbiter: OrbiterParameters}): Promise<string> =>
  version(params);

export const upgradeOrbiter = async ({
  orbiter,
  wasm_module,
  reset = false
}: {
  orbiter: OrbiterParameters;
  wasm_module: Uint8Array;
  reset?: boolean;
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
      wasm_module,
      mode: reset ? {reinstall: null} : {upgrade: [{skip_pre_upgrade: [false]}]}
    }
  });
};

export const orbiterMemorySize = (params: {orbiter: OrbiterParameters}): Promise<MemorySize> =>
  memorySize(params);

export const listOrbiterControllers = (params: {
  orbiter: OrbiterParameters;
}): Promise<[Principal, Controller][]> => listControllers(params);
