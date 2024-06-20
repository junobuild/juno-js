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
  StorageConfigRawAccess as StorageConfigRawAccessDid,
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

/**
 * Sets the configuration for a satellite.
 * @param {Object} params - The parameters for setting the configuration.
 * @param {Object} params.config - The satellite configuration.
 * @param {Object} params.config.storage - The storage configuration.
 * @param {Array<StorageConfigHeader>} params.config.storage.headers - The headers configuration.
 * @param {Array<StorageConfigRewrite>} params.config.storage.rewrites - The rewrites configuration.
 * @param {Array<StorageConfigRedirect>} params.config.storage.redirects - The redirects configuration.
 * @param {string} params.config.storage.iframe - The iframe configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the configuration is set.
 */
export const setConfig = async ({
  config: {
    storage: {
      headers: configHeaders,
      rewrites: configRewrites,
      redirects: configRedirects,
      iframe: configIFrame,
      rawAccess: configRawAccess
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

  const rawAccess: StorageConfigRawAccessDid =
    configRawAccess === true ? {Allow: null} : {Deny: null};

  return setConfigApi({
    satellite,
    config: {
      storage: {
        headers,
        rewrites,
        redirects: [redirects],
        iframe: [iframe],
        raw_access: [rawAccess]
      }
    }
  });
};

/**
 * Sets the authentication configuration for a satellite.
 * @param {Object} params - The parameters for setting the authentication configuration.
 * @param {Object} params.config - The satellite configuration.
 * @param {Object} params.config.authentication - The authentication configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the authentication configuration is set.
 */
export const setAuthConfig = async ({
  config: {
    authentication: {internetIdentity}
  },
  ...rest
}: {
  config: Required<Pick<SatelliteConfig, 'authentication'>>;
  satellite: SatelliteParameters;
}): Promise<void> => {
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

/**
 * Gets the authentication configuration for a satellite.
 * @param {Object} params - The parameters for getting the authentication configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<AuthenticationConfig | undefined>} A promise that resolves to the authentication configuration or undefined if not found.
 */
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

/**
 * Lists the rules for a satellite.
 * @param {Object} params - The parameters for listing the rules.
 * @param {RulesType} params.type - The type of rules to list.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<Rule[]>} A promise that resolves to an array of rules.
 */
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

/**
 * Sets a rule for a satellite.
 * @param {Object} params - The parameters for setting the rule.
 * @param {Rule} params.rule - The rule to set.
 * @param {RulesType} params.type - The type of rule.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the rule is set.
 */
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

/**
 * Retrieves the version of the satellite.
 * @param {Object} params - The parameters for retrieving the version.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<string>} A promise that resolves to the version of the satellite.
 */
export const satelliteVersion = (params: {satellite: SatelliteParameters}): Promise<string> =>
  version(params);

/**
 * Retrieves the build version of the satellite.
 * @param {Object} params - The parameters for retrieving the build version.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<string>} A promise that resolves to the build version of the satellite.
 */
export const satelliteBuildVersion = (params: {satellite: SatelliteParameters}): Promise<string> =>
  buildVersion(params);

/**
 * Retrieves the build type of the satellite.
 * @param {Object} params - The parameters for retrieving the build type.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<BuildType | undefined>} A promise that resolves to the build type of the satellite or undefined if not found.
 */
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

/**
 * Lists the custom domains for a satellite.
 * @param {Object} params - The parameters for listing the custom domains.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<CustomDomain[]>} A promise that resolves to an array of custom domains.
 */
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

/**
 * Sets the custom domains for a satellite.
 * @param {Object} params - The parameters for setting the custom domains.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {CustomDomain[]} params.domains - The custom domains to set.
 * @returns {Promise<void[]>} A promise that resolves when the custom domains are set.
 */
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

/**
 * Retrieves the memory size of a satellite.
 * @param {Object} params - The parameters for retrieving the memory size.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<MemorySize>} A promise that resolves to the memory size of the satellite.
 */
export const satelliteMemorySize = (params: {
  satellite: SatelliteParameters;
}): Promise<MemorySize> => memorySize(params);

/**
 * Counts the documents in a collection.
 * @param {Object} params - The parameters for counting the documents.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<bigint>} A promise that resolves to the number of documents in the collection.
 */
export const countDocs = async (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<bigint> => countDocsApi(params);

/**
 * Deletes the documents in a collection.
 * @param {Object} params - The parameters for deleting the documents.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the documents are deleted.
 */
export const deleteDocs = async (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<void> => deleteDocsApi(params);

/**
 * Counts the assets in a collection.
 * @param {Object} params - The parameters for counting the assets.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<bigint>} A promise that resolves to the number of assets in the collection.
 */
export const countAssets = async (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<bigint> => countAssetsApi(params);

/**
 * Deletes the assets in a collection.
 * @param {Object} params - The parameters for deleting the assets.
 * @param {string} params.collection - The name of the collection.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the assets are deleted.
 */
export const deleteAssets = async (params: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<void> => deleteAssetsApi(params);

/**
 * Lists the controllers of a satellite.
 * @param {Object} params - The parameters for listing the controllers.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {boolean} [params.deprecatedNoScope] - Whether to list deprecated no-scope controllers.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
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

/**
 * Sets the controllers of a satellite.
 * @param {Object} params - The parameters for setting the controllers.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {SetControllersArgs} params.args - The arguments for setting the controllers.
 * @returns {Promise<[Principal, Controller][]>} A promise that resolves to a list of controllers.
 */
export const setSatelliteControllers = (params: {
  satellite: SatelliteParameters;
  args: SetControllersArgs;
}): Promise<[Principal, Controller][]> => setControllers(params);
