import {IDL} from '@dfinity/candid';
import {Principal} from '@dfinity/principal';
import type {
  AuthenticationConfig,
  Rule,
  RulesType,
  SatelliteConfig,
  StorageConfigHeader,
  StorageConfigRedirect,
  StorageConfigRewrite
} from '@junobuild/config';
import {fromNullable, isNullish, nonNullish} from '@junobuild/utils';
import type {
  Controller,
  MemorySize,
  SetControllersArgs,
  StorageConfigIFrame as StorageConfigIFrameDid,
  StorageConfigRedirect as StorageConfigRedirectDid
} from '../../declarations/satellite/satellite.did';
import {canisterMetadata, upgradeCode} from '../api/ic.api';
import {
  buildVersion,
  countAssets as countAssetsApi,
  countDocs as countDocsApi,
  deleteAssets as deleteAssetsApi,
  deleteDocs as deleteDocsApi,
  getAuthConfig as getAuthConfigApi,
  listControllers,
  listCustomDomains as listCustomDomainsApi,
  listDeprecatedControllers,
  listDeprecatedNoScopeControllers,
  listRules as listRulesApi,
  memorySize,
  setAuthConfig as setAuthConfigApi,
  setConfig as setConfigApi,
  setControllers,
  setCustomDomain as setCustomDomainApi,
  setRule as setRuleApi,
  version
} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor.types';
import type {BuildType} from '../types/build.types';
import type {CustomDomain} from '../types/customdomain.types';
import {encodeIDLControllers} from '../utils/idl.utils';
import {mapRule, mapRuleType, mapSetRule} from '../utils/rule.utils';

export const setConfig = async ({
  config: {
    storage: {
      headers: configHeaders,
      rewrites: configRewrites,
      redirects: configRedirects,
      iframe: configIFrame
    }
  },
  satellite
}: {
  config: Required<Pick<SatelliteConfig, 'storage'>>;
  satellite: SatelliteParameters;
}): Promise<void> => {
  const headers: [string, [string, string][]][] = (configHeaders ?? []).map(
    ({source, headers}: StorageConfigHeader) => [source, headers]
  );

  const rewrites: [string, string][] = (configRewrites ?? []).map(
    ({source, destination}: StorageConfigRewrite) => [source, destination]
  );

  const redirects: [string, StorageConfigRedirectDid][] = (configRedirects ?? []).map(
    ({source, location, code}: StorageConfigRedirect) => [source, {status_code: code, location}]
  );

  const iframe: StorageConfigIFrameDid =
    configIFrame === 'same-origin'
      ? {SameOrigin: null}
      : configIFrame === 'allow-any'
        ? {AllowAny: null}
        : {Deny: null};

  return setConfigApi({
    satellite,
    config: {
      storage: {
        headers,
        rewrites,
        redirects: [redirects],
        iframe: [iframe],
        raw_access: []
      }
    }
  });
};

export const setAuthConfig = async ({
  config: {
    authentication: {internetIdentity}
  },
  ...rest
}: {
  config: Required<Pick<SatelliteConfig, 'authentication'>>;
  satellite: SatelliteParameters;
}) => {
  await setAuthConfigApi({
    config: {
      internet_identity: isNullish(internetIdentity?.derivationOrigin)
        ? []
        : [
            {
              derivation_origin: [internetIdentity.derivationOrigin]
            }
          ]
    },
    ...rest
  });
};

export const getAuthConfig = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<AuthenticationConfig | undefined> => {
  const config = fromNullable(
    await getAuthConfigApi({
      satellite
    })
  );

  if (isNullish(config)) {
    return undefined;
  }

  const internetIdentity = fromNullable(config.internet_identity ?? []);

  return {
    ...(nonNullish(internetIdentity) && {
      internetIdentity: {
        ...(nonNullish(fromNullable(internetIdentity.derivation_origin)) && {
          derivationOrigin: fromNullable(internetIdentity.derivation_origin)
        })
      }
    })
  };
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

export const satelliteVersion = (params: {satellite: SatelliteParameters}): Promise<string> =>
  version(params);

export const satelliteBuildVersion = (params: {satellite: SatelliteParameters}): Promise<string> =>
  buildVersion(params);

export const satelliteBuildType = async ({
  satellite: {satelliteId, ...rest}
}: {
  satellite: SatelliteParameters;
}): Promise<BuildType | undefined> => {
  const status = await canisterMetadata({...rest, canisterId: satelliteId, path: 'juno:build'});

  return nonNullish(status) && ['stock', 'extended'].includes(status as string)
    ? (status as BuildType)
    : undefined;
};

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
}) => {
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
        mode: reset ? {reinstall: null} : {upgrade: [{skip_pre_upgrade: [false]}]}
      }
    });

    return;
  }

  const list = deprecatedNoScope ? listDeprecatedNoScopeControllers : listControllers;

  const controllers = await list({satellite});

  const arg = encodeIDLControllers(controllers);

  await upgradeCode({
    actor,
    code: {
      canister_id: Principal.fromText(satelliteId),
      arg: new Uint8Array(arg),
      wasm_module,
      mode: reset ? {reinstall: null} : {upgrade: [{skip_pre_upgrade: [false]}]}
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

export const setCustomDomains = async ({
  satellite,
  domains
}: {
  satellite: SatelliteParameters;
  domains: CustomDomain[];
}): Promise<void[]> =>
  Promise.all(
    domains.map(({domain: domainName, bn_id: boundaryNodesId}) =>
      setCustomDomainApi({
        satellite,
        domainName,
        boundaryNodesId
      })
    )
  );

export const satelliteMemorySize = (params: {
  satellite: SatelliteParameters;
}): Promise<MemorySize> => memorySize(params);

export const countDocs = async (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<bigint> => countDocsApi(params);

export const deleteDocs = async (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<void> => deleteDocsApi(params);

export const countAssets = async (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<bigint> => countAssetsApi(params);

export const deleteAssets = async (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<void> => deleteAssetsApi(params);

export const listSatelliteControllers = ({
  deprecatedNoScope,
  ...params
}: {
  satellite: SatelliteParameters;
  deprecatedNoScope?: boolean;
}): Promise<[Principal, Controller][]> => {
  const list = deprecatedNoScope === true ? listDeprecatedNoScopeControllers : listControllers;
  return list(params);
};

export const setSatelliteControllers = (params: {
  satellite: SatelliteParameters;
  args: SetControllersArgs;
}): Promise<[Principal, Controller][]> => setControllers(params);
