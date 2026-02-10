import {fromNullable, isNullish, nonNullish, toNullable} from '@dfinity/utils';
import {Principal} from '@icp-sdk/core/principal';
import type {
  AuthenticationConfig,
  AutomationConfig,
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
          providers: [
            [
              {Google: null},
              {
                client_id: google.clientId,
                delegation: isNullish(google.delegation)
                  ? []
                  : [
                      {
                        targets:
                          google.delegation.allowedTargets === null
                            ? []
                            : [
                                (google.delegation.allowedTargets ?? [])?.map((target) =>
                                  Principal.fromText(target)
                                )
                              ],
                        max_time_to_live: toNullable(google.delegation.sessionDuration)
                      }
                    ]
              }
            ]
          ],
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

  const delegation = fromNullable(google?.delegation ?? []);
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
        ...(withDelegation && {
          delegation: {
            ...(targets !== undefined && {allowedTargets: targets}),
            ...(nonNullish(maxTimeToLive) && {sessionDuration: maxTimeToLive})
          }
        })
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

export const fromAutomationConfig = ({
  github,
  version
}: AutomationConfig): SatelliteDid.SetAutomationConfig => {
  if (isNullish(github)) {
    return {openid: [], version: toNullable(version)};
  }

  const {repositories, accessKeys} = github;

  const repositoriesMap: Map<
    SatelliteDid.RepositoryKey,
    SatelliteDid.OpenIdAutomationRepositoryConfig
  > = new Map(
    repositories.map(({owner, name, branches}) => [
      {owner, name},
      {branches: (branches?.length ?? 0) > 0 ? toNullable(branches) : toNullable()}
    ])
  );

  const controller: SatelliteDid.OpenIdAutomationProviderControllerConfig | undefined = isNullish(
    accessKeys
  )
    ? undefined
    : {
        scope: toNullable(
          accessKeys.scope === 'Write'
            ? {Write: null}
            : accessKeys.scope === 'Submit'
              ? {Submit: null}
              : undefined
        ),
        max_time_to_live: toNullable(accessKeys.timeToLive)
      };

  return {
    openid: [
      {
        providers: [
          [
            {GitHub: null},
            {
              repositories: [...repositoriesMap],
              controller: toNullable(controller)
            }
          ]
        ],
        observatory_id: []
      }
    ],
    version: toNullable(version)
  };
};

export const toAutomationConfig = ({
  version,
  openid: openIdDid
}: SatelliteDid.AutomationConfig): AutomationConfig => {
  const openId = fromNullable(openIdDid);
  const github = openId?.providers.find(([key]) => 'GitHub' in key)?.[1];

  const repositories = (github?.repositories ?? []).map(([key, config]) => ({
    ...key,
    ...(nonNullish(fromNullable(config.branches)) && {
      branches: fromNullable(config.branches)
    })
  }));

  const controller = fromNullable(github?.controller ?? []);
  const scope = fromNullable(controller?.scope ?? []);
  const maxTimeToLive = fromNullable(controller?.max_time_to_live ?? []);
  const withAccessKeys = nonNullish(scope) || nonNullish(maxTimeToLive);

  return {
    ...(nonNullish(github) && {
      github: {
        repositories,
        ...(withAccessKeys && {
          accessKeys: {
            ...(nonNullish(scope) && {
              scope: 'Write' in scope ? 'Write' : 'Submit' in scope ? 'Submit' : undefined
            }),
            ...(nonNullish(maxTimeToLive) && {timeToLive: maxTimeToLive})
          }
        })
      }
    }),
    version: fromNullable(version)
  };
};
