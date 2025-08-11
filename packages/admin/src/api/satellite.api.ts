import type {Principal} from '@dfinity/principal';
import {toNullable} from '@dfinity/utils';
import {
  type SatelliteDid,
  type SatelliteParameters,
  getDeprecatedSatelliteActor,
  getDeprecatedSatelliteNoScopeActor,
  getDeprecatedSatelliteVersionActor,
  getSatelliteActor
} from '@junobuild/ic-client';

export const setStorageConfig = async ({
  config,
  satellite
}: {
  config: SatelliteDid.SetStorageConfig;
  satellite: SatelliteParameters;
}): Promise<SatelliteDid.StorageConfig> => {
  const {set_storage_config} = await getSatelliteActor(satellite);
  return set_storage_config(config);
};

export const setDatastoreConfig = async ({
  config,
  satellite
}: {
  config: SatelliteDid.SetDbConfig;
  satellite: SatelliteParameters;
}): Promise<SatelliteDid.DbConfig> => {
  const {set_db_config} = await getSatelliteActor(satellite);
  return set_db_config(config);
};

export const setAuthConfig = async ({
  config,
  satellite
}: {
  config: SatelliteDid.SetAuthenticationConfig;
  satellite: SatelliteParameters;
}): Promise<SatelliteDid.AuthenticationConfig> => {
  const {set_auth_config} = await getSatelliteActor(satellite);
  return set_auth_config(config);
};

export const getStorageConfig = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<SatelliteDid.StorageConfig> => {
  const {get_storage_config} = await getSatelliteActor(satellite);
  return get_storage_config();
};

export const getDatastoreConfig = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[] | [SatelliteDid.DbConfig]> => {
  const {get_db_config} = await getSatelliteActor(satellite);
  return get_db_config();
};

export const getAuthConfig = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[] | [SatelliteDid.AuthenticationConfig]> => {
  const {get_auth_config} = await getSatelliteActor(satellite);
  return get_auth_config();
};

export const getConfig = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<SatelliteDid.Config> => {
  const {get_config} = await getSatelliteActor(satellite);
  return get_config();
};

export const listRules = async ({
  satellite,
  type,
  filter
}: {
  satellite: SatelliteParameters;
  type: SatelliteDid.CollectionType;
  filter: SatelliteDid.ListRulesParams;
}): Promise<SatelliteDid.ListRulesResults> => {
  const {list_rules} = await getSatelliteActor(satellite);
  return list_rules(type, filter);
};

export const setRule = async ({
  type,
  collection,
  rule,
  satellite
}: {
  type: SatelliteDid.CollectionType;
  collection: string;
  rule: SatelliteDid.SetRule;
  satellite: SatelliteParameters;
}): Promise<SatelliteDid.Rule> => {
  const {set_rule} = await getSatelliteActor(satellite);
  return set_rule(type, collection, rule);
};

/**
 * @deprecated - Replaced in Satellite > v0.0.22 with public custom section juno:package
 */
export const version = async ({satellite}: {satellite: SatelliteParameters}): Promise<string> => {
  const {version} = await getDeprecatedSatelliteVersionActor(satellite);
  return version();
};

/**
 * @deprecated TODO: for backwards compatibility - to be removed
 */
export const listDeprecatedControllers = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<Principal[]> => {
  const {list_controllers} = await getDeprecatedSatelliteActor(satellite);
  return list_controllers();
};

/**
 * @deprecated TODO: for backwards compatibility - to be removed
 */
export const listDeprecatedNoScopeControllers = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[Principal, SatelliteDid.Controller][]> => {
  const {list_controllers} = await getDeprecatedSatelliteNoScopeActor(satellite);
  return list_controllers() as Promise<[Principal, SatelliteDid.Controller][]>;
};

export const listControllers = async ({
  satellite,
  certified
}: {
  satellite: SatelliteParameters;
  certified?: boolean;
}): Promise<[Principal, SatelliteDid.Controller][]> => {
  const {list_controllers} = await getSatelliteActor({...satellite, certified});
  return list_controllers();
};

export const listCustomDomains = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[string, SatelliteDid.CustomDomain][]> => {
  const {list_custom_domains} = await getSatelliteActor(satellite);
  return list_custom_domains();
};

export const setCustomDomain = async ({
  satellite,
  domainName,
  boundaryNodesId
}: {
  satellite: SatelliteParameters;
  domainName: string;
  boundaryNodesId: string | undefined;
}): Promise<void> => {
  const {set_custom_domain} = await getSatelliteActor(satellite);
  await set_custom_domain(domainName, toNullable(boundaryNodesId));
};

export const memorySize = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<SatelliteDid.MemorySize> => {
  const {memory_size} = await getSatelliteActor(satellite);
  return memory_size();
};

export const countDocs = async ({
  collection,
  satellite
}: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<bigint> => {
  const {count_collection_docs} = await getSatelliteActor(satellite);
  return count_collection_docs(collection);
};

export const countAssets = async ({
  collection,
  satellite
}: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<bigint> => {
  const {count_collection_assets} = await getSatelliteActor(satellite);
  return count_collection_assets(collection);
};

export const deleteDocs = async ({
  collection,
  satellite
}: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<void> => {
  const {del_docs} = await getSatelliteActor(satellite);
  return del_docs(collection);
};

export const deleteAssets = async ({
  collection,
  satellite
}: {
  collection: string;
  satellite: SatelliteParameters;
}): Promise<void> => {
  const {del_assets} = await getSatelliteActor(satellite);
  return del_assets(collection);
};

export const setControllers = async ({
  args,
  satellite
}: {
  args: SatelliteDid.SetControllersArgs;
  satellite: SatelliteParameters;
}): Promise<[Principal, SatelliteDid.Controller][]> => {
  const {set_controllers} = await getSatelliteActor(satellite);
  return set_controllers(args);
};
