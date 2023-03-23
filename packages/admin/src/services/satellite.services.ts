import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {upgradeCode} from '../api/ic.api';
import {
  listControllers,
  listDeprecatedControllers,
  listRules as listRulesApi,
  setConfig as setConfigApi,
  setRule as setRuleApi,
  version
} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor.types';
import type {Config, StorageConfigHeaders} from '../types/config.types';
import {Rule, RulesType} from '../types/rules.types';
import {mapRule, mapRuleType, mapSetRule} from '../utils/rule.utils';

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

export const listRules = async ({
  type,
  satellite
}: {
  type: RulesType;
  satellite: SatelliteParameters;
}): Promise<Rule[]> => {
  const rules = await listRulesApi({
    satellite,
    type: mapRuleType(type)
  });

  return rules.map((rule) => mapRule(rule));
};

export const setRule = async ({
  rule: {collection, ...rest},
  type,
  satellite
}: {
  rule: Rule;
  type: RulesType;
  satellite: SatelliteParameters;
}): Promise<void> =>
  setRuleApi({
    type: mapRuleType(type),
    rule: mapSetRule(rest),
    satellite,
    collection
  });

export const satelliteVersion = async (params: {satellite: SatelliteParameters}): Promise<string> =>
  version(params);

export const upgradeSatellite = async ({
  satellite,
  wasm_module,
  deprecated
}: {
  satellite: SatelliteParameters;
  wasm_module: Array<number>;
  deprecated: boolean;
}) => {
  const {satelliteId, ...actor} = satellite;

  if (!satelliteId) {
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
        arg: [...new Uint8Array(arg)],
        wasm_module
      }
    });

    return;
  }

  const controllers = await listControllers({satellite});

  const arg = IDL.encode(
    [
      IDL.Record({
        controllers: IDL.Vec(IDL.Principal)
      })
    ],
    [{controllers: controllers.map(([controller, _]) => controller)}]
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
