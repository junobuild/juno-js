import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {upgradeCode} from '../api/ic.api';
import {listControllers, setConfig as setConfigApi, version} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor.types';
import type {Config, StorageConfigHeaders} from '../types/config.types';

export const setConfig = async ({
  config: {
    storage: {headers: configHeaders}
  },
  satellite
}: {
  config: Config;
  satellite: SatelliteParameters;
}): Promise<void> => {
  const headers: [string, [string, string][]][] = configHeaders.map(
    ({source, headers}: StorageConfigHeaders) => [source, headers]
  );

  return setConfigApi({
    satellite,
    config: {
      storage: {
        headers
      }
    }
  });
};

export const satelliteVersion = async (params: {satellite: SatelliteParameters}): Promise<string> =>
  version(params);

export const upgradeSatellite = async ({
  satellite,
  wasm_module
}: {
  satellite: SatelliteParameters;
  wasm_module: Array<number>;
}) => {
  const controllers = await listControllers({satellite});

  const {satelliteId, ...actor} = satellite;

  if (!satelliteId) {
    throw new Error('No satellite principal defined.');
  }

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
      arg: [...new Uint8Array(arg)],
      wasm_module
    }
  });
};
