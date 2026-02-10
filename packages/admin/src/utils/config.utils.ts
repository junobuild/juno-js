import {fromNullable, isNullish, nonNullish, toNullable} from '@dfinity/utils';
import {Principal} from '@icp-sdk/core/principal';
import type {
  AuthenticationConfig,
  AuthenticationConfigGitHub,
  AuthenticationConfigGoogle,
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
  github,
  google,
  rules,
  version
}: AuthenticationConfig): SatelliteDid.SetAuthenticationConfig => {
  const fromAuthenticationOpenIdConfig = (
    config: AuthenticationConfigGoogle | AuthenticationConfigGitHub
  ): SatelliteDid.OpenIdAuthProviderConfig => ({
    client_id: config.clientId,
    delegation: isNullish(config.delegation)
      ? []
      : [
          {
            targets:
              config.delegation.allowedTargets === null
                ? []
                : [
                    (config.delegation.allowedTargets ?? [])?.map((target) =>
                      Principal.fromText(target)
                    )
                  ],
            max_time_to_live: toNullable(config.delegation.sessionDuration)
          }
        ]
  });

  const providers = [
    ...(isNullish(google)
      ? []
      : ([[{Google: null}, fromAuthenticationOpenIdConfig(google)]] as [
          SatelliteDid.OpenIdDelegationProvider,
          SatelliteDid.OpenIdAuthProviderConfig
        ][])),
    ...(isNullish(github)
      ? []
      : ([[{GitHub: null}, fromAuthenticationOpenIdConfig(github)]] as [
          SatelliteDid.OpenIdDelegationProvider,
          SatelliteDid.OpenIdAuthProviderConfig
        ][]))
  ];

  return {
    internet_identity: isNullish(internetIdentity)
      ? []
      : [
          {
            derivation_origin: toNullable(internetIdentity?.derivationOrigin),
            external_alternative_origins: toNullable(internetIdentity?.externalAlternativeOrigins)
          }
        ],
    openid:
      providers.length === 0
        ? []
        : [
            {
              providers,
              observatory_id: []
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
  };
};

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

  const toDelegation = (
    provider: SatelliteDid.OpenIdAuthProviderConfig | undefined
  ):
    | Omit<AuthenticationConfigGoogle, 'clientId'>
    | Omit<AuthenticationConfigGitHub, 'clientId'> => {
    const delegation = fromNullable(provider?.delegation ?? []);
    const targets =
      // delegation.targets===[] (exactly equals because delegation is undefined by default)
      nonNullish(delegation) && nonNullish(delegation.targets) && delegation.targets.length === 0
        ? null
        : // delegation.targets===[[]]
          (fromNullable(delegation?.targets ?? []) ?? []).length === 0
          ? undefined
          : (fromNullable(delegation?.targets ?? []) ?? []).map((p) => p.toText());
    const maxTimeToLive = fromNullable(delegation?.max_time_to_live ?? []);
    const withDelegation = targets !== undefined || nonNullish(maxTimeToLive);

    return {
      ...(withDelegation && {
        delegation: {
          ...(targets !== undefined && {allowedTargets: targets}),
          ...(nonNullish(maxTimeToLive) && {sessionDuration: maxTimeToLive})
        }
      })
    };
  };

  const openId = fromNullable(openIdDid);
  const google = openId?.providers.find(([key]) => 'Google' in key)?.[1];
  const github = openId?.providers.find(([key]) => 'GitHub' in key)?.[1];

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
        clientId: google.client_id,
        ...toDelegation(google)
      }
    }),
    ...(nonNullish(github) && {
      github: {
        clientId: github.client_id,
        ...toDelegation(github)
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
