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
  AuthenticationConfig as AuthenticationConfigDid,
  DbConfig as DbConfigDid,
  SetAuthenticationConfig,
  SetDbConfig,
  SetStorageConfig,
  StorageConfig as StorageConfigDid,
  StorageConfigIFrame as StorageConfigIFrameDid,
  StorageConfigRawAccess as StorageConfigRawAccessDid,
  StorageConfigRedirect as StorageConfigRedirectDid
} from '../../declarations/satellite/satellite.did';
import {fromMaxMemorySize, toMaxMemorySize} from './memory.utils';

export const fromStorageConfig = ({
  headers: configHeaders,
  rewrites: configRewrites,
  redirects: configRedirects,
  iframe: configIFrame,
  rawAccess: configRawAccess,
  maxMemorySize: configMaxMemorySize,
  version: configVersion
}: Omit<StorageConfig, 'createdAt' | 'updatedAt'>): SetStorageConfig => {
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

  return {
    headers,
    rewrites,
    redirects: [redirects],
    iframe: [iframe],
    raw_access: [rawAccess],
    max_memory_size: toMaxMemorySize(configMaxMemorySize),
    version: toNullable(configVersion)
  };
};

export const toStorageConfig = ({
  redirects: redirectsDid,
  iframe: iframeDid,
  version,
  raw_access: rawAccessDid,
  max_memory_size,
  updated_at,
  created_at,
  headers: headersDid,
  rewrites: rewritesDid
}: StorageConfigDid): StorageConfig => {
  const redirects = fromNullable(redirectsDid)?.map<StorageConfigRedirect>(
    ([source, {status_code: code, ...rest}]) => ({
      ...rest,
      code: code as 301 | 302,
      source
    })
  );

  const rawAccess = nonNullish(rawAccessDid) ? 'Allow' in rawAccessDid : undefined;

  const iframe = nonNullish(iframeDid)
    ? 'SameOrigin' in iframeDid
      ? 'same-origin'
      : 'AllowAny' in iframeDid
        ? 'allow-any'
        : 'deny'
    : undefined;

  const maxMemorySize = fromMaxMemorySize(max_memory_size);

  const headers = headersDid.map<StorageConfigHeader>(([source, headers]) => ({source, headers}));

  const rewrites = rewritesDid.map<StorageConfigRewrite>(([source, destination]) => ({
    source,
    destination
  }));

  return {
    ...(headers.length > 0 && {headers}),
    ...(rewrites.length > 0 && {rewrites}),
    ...(nonNullish(redirects) && {redirects}),
    ...(nonNullish(iframe) && {
      iframe
    }),
    version: fromNullable(version),
    ...(nonNullish(rawAccess) && {rawAccess}),
    ...maxMemorySize,
    updatedAt: fromNullable(updated_at),
    createdAt: fromNullable(created_at)
  };
};

export const fromDatastoreConfig = ({
  maxMemorySize,
  version
}: Omit<DatastoreConfig, 'createdAt' | 'updatedAt'>): SetDbConfig => ({
  max_memory_size: toMaxMemorySize(maxMemorySize),
  version: toNullable(version)
});

export const toDatastoreConfig = ({
  version,
  max_memory_size,
  created_at,
  updated_at
}: DbConfigDid): DatastoreConfig => ({
  ...fromMaxMemorySize(max_memory_size),
  version: fromNullable(version),
  updatedAt: fromNullable(updated_at),
  createdAt: fromNullable(created_at)
});

export const fromAuthenticationConfig = ({
  internetIdentity,
  version
}: Omit<AuthenticationConfig, 'createdAt' | 'updatedAt'>): SetAuthenticationConfig => ({
  internet_identity: isNullish(internetIdentity)
    ? []
    : [
        {
          derivation_origin: toNullable(internetIdentity?.derivationOrigin),
          external_alternative_origins: toNullable(internetIdentity?.externalAlternativeOrigins)
        }
      ],
  version: fromNullable(version)
});

export const toAuthenticationConfig = ({
  version,
  internet_identity,
  created_at,
  updated_at
}: AuthenticationConfigDid): AuthenticationConfig => {
  const internetIdentity = fromNullable(internet_identity);
  const derivationOrigin = fromNullable(internetIdentity?.derivation_origin ?? []);
  const externalAlternativeOrigins = fromNullable(
    internetIdentity?.external_alternative_origins ?? []
  );

  return {
    ...(nonNullish(internetIdentity) && {
      internetIdentity: {
        ...(nonNullish(derivationOrigin) && {derivationOrigin}),
        ...(nonNullish(externalAlternativeOrigins) && {externalAlternativeOrigins})
      }
    }),
    version: fromNullable(version),
    updatedAt: fromNullable(updated_at),
    createdAt: fromNullable(created_at)
  };
};
