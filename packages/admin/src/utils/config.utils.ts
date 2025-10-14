import {Principal} from '@dfinity/principal';
import {fromNullable, isNullish, nonNullish, toNullable} from '@dfinity/utils';
import type {
  AuthenticationConfig,
  DatastoreConfig,
  StorageConfig,
  StorageConfigHeader,
  StorageConfigRedirect,
  StorageConfigRewrite
} from '@junobuild/config';
import type {SatelliteDid} from '@junobuild/ic-client/actor';
import {fromMaxMemorySize, toMaxMemorySize} from './memory.utils';

export const fromStorageConfig = ({
  headers: configHeaders,
  rewrites: configRewrites,
  redirects: configRedirects,
  iframe: configIFrame,
  rawAccess: configRawAccess,
  maxMemorySize: configMaxMemorySize,
  version: configVersion
}: StorageConfig): SatelliteDid.SetStorageConfig => {
  const headers: [string, [string, string][]][] = (configHeaders ?? []).map(
    ({source, headers}: StorageConfigHeader) => [source, headers]
  );

  const rewrites: [string, string][] = (configRewrites ?? []).map(
    ({source, destination}: StorageConfigRewrite) => [source, destination]
  );

  const redirects: [string, SatelliteDid.StorageConfigRedirect][] = (configRedirects ?? []).map(
    ({source, location, code}: StorageConfigRedirect) => [source, {status_code: code, location}]
  );

  const iframe: SatelliteDid.StorageConfigIFrame =
    configIFrame === 'same-origin'
      ? {SameOrigin: null}
      : configIFrame === 'allow-any'
        ? {AllowAny: null}
        : {Deny: null};

  const rawAccess: SatelliteDid.StorageConfigRawAccess =
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
  headers: headersDid,
  rewrites: rewritesDid
}: SatelliteDid.StorageConfig): StorageConfig => {
  const redirects = fromNullable(redirectsDid)?.map<StorageConfigRedirect>(
    ([source, {status_code: code, ...rest}]) => ({
      ...rest,
      code: code as 301 | 302,
      source
    })
  );

  const access = fromNullable(rawAccessDid);
  const rawAccess = nonNullish(access) ? 'Allow' in access : undefined;

  const frame = fromNullable(iframeDid);
  const iframe = nonNullish(frame)
    ? 'SameOrigin' in frame
      ? 'same-origin'
      : 'AllowAny' in frame
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
    ...maxMemorySize
  };
};

export const fromDatastoreConfig = ({
  maxMemorySize,
  version
}: DatastoreConfig): SatelliteDid.SetDbConfig => ({
  max_memory_size: toMaxMemorySize(maxMemorySize),
  version: toNullable(version)
});

export const toDatastoreConfig = ({
  version,
  max_memory_size
}: SatelliteDid.DbConfig): DatastoreConfig => ({
  ...fromMaxMemorySize(max_memory_size),
  version: fromNullable(version)
});

export const fromAuthenticationConfig = ({
  internetIdentity,
  google,
  rules,
  version
}: AuthenticationConfig): SatelliteDid.SetAuthenticationConfig => ({
  internet_identity: isNullish(internetIdentity)
    ? []
    : [
        {
          derivation_origin: toNullable(internetIdentity?.derivationOrigin),
          external_alternative_origins: toNullable(internetIdentity?.externalAlternativeOrigins)
        }
      ],
  openid: isNullish(google)
    ? []
    : [
        {
          providers: [[{Google: null}, {client_id: google.clientId}]]
        }
      ],
  rules: isNullish(rules)
    ? []
    : [
        {
          allowed_callers: rules.allowedCallers.map((caller) => Principal.fromText(caller))
        }
      ],
  version: toNullable(version)
});

export const toAuthenticationConfig = ({
  version,
  internet_identity,
  openid: openIdDid,
  rules: rulesDid
}: SatelliteDid.AuthenticationConfig): AuthenticationConfig => {
  const internetIdentity = fromNullable(internet_identity);
  const derivationOrigin = fromNullable(internetIdentity?.derivation_origin ?? []);
  const externalAlternativeOrigins = fromNullable(
    internetIdentity?.external_alternative_origins ?? []
  );

  const openId = fromNullable(openIdDid);
  const google = openId?.providers.find(([key]) => 'Google' in key)?.[1];

  const rules = fromNullable(rulesDid);

  return {
    ...(nonNullish(internetIdentity) && {
      internetIdentity: {
        ...(nonNullish(derivationOrigin) && {derivationOrigin}),
        ...(nonNullish(externalAlternativeOrigins) && {externalAlternativeOrigins})
      }
    }),
    ...(nonNullish(google) && {
      google: {
        clientId: google.client_id
      }
    }),
    ...(nonNullish(rules) && {
      rules: {
        allowedCallers: rules.allowed_callers.map((caller) => caller.toText())
      }
    }),
    version: fromNullable(version)
  };
};
