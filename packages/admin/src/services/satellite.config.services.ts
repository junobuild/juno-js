import {fromNullable, isNullish, nonNullish} from '@dfinity/utils';
import type {
  AuthenticationConfig,
  DatastoreConfig,
  StorageConfig,
  StorageConfigHeader,
  StorageConfigRedirect,
  StorageConfigRewrite
} from '@junobuild/config';
import {
  getAuthConfig as getAuthConfigApi,
  setAuthConfig as setAuthConfigApi,
  setDatastoreConfig as setDatastoreConfigApi,
  setStorageConfig as setStorageConfigApi
} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor';
import {
  fromAuthenticationConfig,
  fromDatastoreConfig,
  fromStorageConfig,
  toAuthenticationConfig,
  toDatastoreConfig,
  toStorageConfig
} from '../utils/config.utils';

/**
 * Sets the configuration for the Storage of a Satellite.
 * @param {Object} params - The parameters for setting the configuration.
 * @param {Object} params.config - The storage configuration.
 * @param {Array<StorageConfigHeader>} params.config.headers - The headers configuration.
 * @param {Array<StorageConfigRewrite>} params.config.rewrites - The rewrites configuration.
 * @param {Array<StorageConfigRedirect>} params.config.redirects - The redirects configuration.
 * @param {string} params.config.iframe - The iframe configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves with the applied configuration when set.
 */
export const setStorageConfig = async ({
  config,
  satellite
}: {
  config: Omit<StorageConfig, 'createdAt' | 'updatedAt'>;
  satellite: SatelliteParameters;
}): Promise<StorageConfig> => {
  const result = await setStorageConfigApi({
    satellite,
    config: fromStorageConfig(config)
  });

  return toStorageConfig(result);
};

/**
 * Sets the datastore configuration for a satellite.
 * @param {Object} params - The parameters for setting the authentication configuration.
 * @param {Object} params.config - The datastore configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves with the config when the datastore configuration is set.
 */
export const setDatastoreConfig = async ({
  config,
  ...rest
}: {
  config: Omit<DatastoreConfig, 'createdAt' | 'updatedAt'>;
  satellite: SatelliteParameters;
}): Promise<DatastoreConfig> => {
  const result = await setDatastoreConfigApi({
    config: fromDatastoreConfig(config),
    ...rest
  });

  return toDatastoreConfig(result);
};

/**
 * Sets the authentication configuration for a satellite.
 * @param {Object} params - The parameters for setting the authentication configuration.
 * @param {Object} params.config - The authentication configuration.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the authentication configuration is set.
 */
export const setAuthConfig = async ({
  config,
  ...rest
}: {
  config: Omit<AuthenticationConfig, 'createdAt' | 'updatedAt'>;
  satellite: SatelliteParameters;
}): Promise<AuthenticationConfig> => {
  const result = await setAuthConfigApi({
    config: fromAuthenticationConfig(config),
    ...rest
  });

  return toAuthenticationConfig(result);
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
