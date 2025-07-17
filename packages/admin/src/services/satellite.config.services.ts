import {fromNullable, isNullish, nonNullish, toNullable} from '@dfinity/utils';
import type {
  AuthenticationConfig,
  DatastoreConfig,
  StorageConfig,
  StorageConfigHeader,
  StorageConfigRedirect,
  StorageConfigRewrite
} from '@junobuild/config';
import type {
  StorageConfigIFrame as StorageConfigIFrameDid,
  StorageConfigRawAccess as StorageConfigRawAccessDid,
  StorageConfigRedirect as StorageConfigRedirectDid
} from '../../declarations/satellite/satellite.did';
import {
  getAuthConfig as getAuthConfigApi,
  setAuthConfig as setAuthConfigApi,
  setDatastoreConfig as setDatastoreConfigApi,
  setStorageConfig as setStorageConfigApi
} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor';
import {toMaxMemorySize} from '../utils/memory.utils';

/**
 * Sets the configuration for the Storage of a Satellite.
 * @param {Object} params - The parameters for setting the configuration.
 * @param {Object} params.config - The storage configuration.
 * @param {Array<StorageConfigHeader>} params.config.headers - The headers configuration.
 * @param {Array<StorageConfigRewrite>} params.config.rewrites - The rewrites configuration.
 * @param {Array<StorageConfigRedirect>} params.config.redirects - The redirects configuration.
 * @param {string} params.config.iframe - The iframe configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the configuration is set.
 */
export const setStorageConfig = async ({
  config: {
    headers: configHeaders,
    rewrites: configRewrites,
    redirects: configRedirects,
    iframe: configIFrame,
    rawAccess: configRawAccess,
    maxMemorySize: configMaxMemorySize
  },
  satellite
}: {
  config: StorageConfig;
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

  return await setStorageConfigApi({
    satellite,
    config: {
      headers,
      rewrites,
      redirects: [redirects],
      iframe: [iframe],
      raw_access: [rawAccess],
      max_memory_size: toMaxMemorySize(configMaxMemorySize)
    }
  });
};

/**
 * Sets the datastore configuration for a satellite.
 * @param {Object} params - The parameters for setting the authentication configuration.
 * @param {Object} params.config - The datastore configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the datastore configuration is set.
 */
export const setDatastoreConfig = async ({
  config: {maxMemorySize},
  ...rest
}: {
  config: DatastoreConfig;
  satellite: SatelliteParameters;
}): Promise<void> => {
  await setDatastoreConfigApi({
    config: {
      max_memory_size: toMaxMemorySize(maxMemorySize)
    },
    ...rest
  });
};

/**
 * Sets the authentication configuration for a satellite.
 * @param {Object} params - The parameters for setting the authentication configuration.
 * @param {Object} params.config - The authentication configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the authentication configuration is set.
 */
export const setAuthConfig = async ({
  config: {internetIdentity},
  ...rest
}: {
  config: AuthenticationConfig;
  satellite: SatelliteParameters;
}): Promise<void> => {
  await setAuthConfigApi({
    config: {
      internet_identity: isNullish(internetIdentity)
        ? []
        : [
            {
              derivation_origin: toNullable(internetIdentity?.derivationOrigin),
              external_alternative_origins: toNullable(internetIdentity?.externalAlternativeOrigins)
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
