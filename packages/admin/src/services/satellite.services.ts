import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import {fromNullable} from '@junobuild/utils';
import {upgradeCode} from '../api/ic.api';
import {
  listControllers,
  listCustomDomains as listCustomDomainsApi,
  listDeprecatedControllers,
  listDeprecatedNoScopeControllers,
  listRules as listRulesApi,
  setConfig as setConfigApi,
  setRule as setRuleApi,
  version
} from '../api/satellite.api';
import {DEFAULT_CONFIG_REWRITES} from '../constants/config.constants';
import type {SatelliteParameters} from '../types/actor.types';
import type {Config, StorageConfigHeader, StorageConfigRewrite} from '../types/config.types';
import type {CustomDomain} from '../types/customdomain.types';
import type {Rule, RulesType} from '../types/rules.types';
import {mapRule, mapRuleType, mapSetRule} from '../utils/rule.utils';

export const setConfig = async ({
  config: {
    storage: {headers: configHeaders, rewrites: configRewrites}
  },
  satellite
}: {
  config: Config;
  satellite: SatelliteParameters;
}): Promise<void> => {
  const headers: [string, [string, string][]][] = (configHeaders ?? []).map(
    ({source, headers}: StorageConfigHeader) => [source, headers]
  );

  const rewrites: [string, string][] = (configRewrites ?? DEFAULT_CONFIG_REWRITES).map(
    ({source, destination}: StorageConfigRewrite) => [source, destination]
  );

  return setConfigApi({
    satellite,
    config: {
      storage: {
        headers,
        rewrites
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
  deprecated,
  deprecatedNoScope
}: {
  satellite: SatelliteParameters;
  wasm_module: Uint8Array;
  deprecated: boolean;
  deprecatedNoScope: boolean;
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
        arg: new Uint8Array(arg),
        wasm_module
      }
    });

    return;
  }

  const list = deprecatedNoScope ? listDeprecatedNoScopeControllers : listControllers;

  const controllers = await list({satellite});

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
      arg: new Uint8Array(arg),
      wasm_module
    }
  });
};

export const listCustomDomains = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<CustomDomain[]> => {
  const domains = await listCustomDomainsApi({
    satellite
  });

  return domains.map(([domain, details]) => ({
    domain,
    bn_id: fromNullable(details.bn_id),
    created_at: details.created_at,
    updated_at: details.updated_at
  }));
};
