import {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@dfinity/utils';
import type {
  AuthenticationConfig,
  DatastoreConfig,
  StorageConfig,
  StorageConfigHeader,
  StorageConfigRedirect,
  StorageConfigRewrite
} from '@junobuild/config';
import type {SatelliteDid} from '@junobuild/ic-client/actor';
import {
  fromAuthenticationConfig,
  fromDatastoreConfig,
  fromStorageConfig,
  toAuthenticationConfig,
  toDatastoreConfig,
  toStorageConfig
} from '../../utils/config.utils';
import {mockSatelliteIdText, mockUserIdText} from '../mocks/admin.mock';

describe('config.utils', () => {
  const now = BigInt(Date.now());

  const redirect: StorageConfigRedirect = {
    source: '/old',
    location: '/new',
    code: 301
  };

  const rewrite: StorageConfigRewrite = {
    source: '/a',
    destination: '/b'
  };

  const header: StorageConfigHeader = {
    source: '/x',
    headers: [['Cache-Control', 'max-age=3600']]
  };

  describe('fromStorageConfig', () => {
    it('maps StorageConfig correctly', () => {
      const config: StorageConfig = {
        redirects: [redirect],
        rewrites: [rewrite],
        headers: [header],
        iframe: 'same-origin',
        rawAccess: true,
        version: 1n,
        maxMemorySize: {
          heap: 123n,
          stable: 456n
        }
      };

      const result = fromStorageConfig(config);

      expect(result.redirects).toEqual([[['/old', {location: '/new', status_code: 301}]]]);
      expect(result.iframe).toEqual([{SameOrigin: null}]);
      expect(result.raw_access).toEqual([{Allow: null}]);
      expect(result.headers).toEqual([['/x', [['Cache-Control', 'max-age=3600']]]]);
      expect(result.rewrites).toEqual([['/a', '/b']]);
      expect(result.version).toEqual([1n]);
      expect(result.max_memory_size).toEqual([{heap: [123n], stable: [456n]}]);
    });

    it('handles nullish fields in fromStorageConfig', () => {
      const result = fromStorageConfig({
        headers: undefined,
        rewrites: undefined,
        redirects: undefined,
        iframe: undefined,
        rawAccess: undefined,
        maxMemorySize: undefined,
        version: undefined
      });

      expect(result.headers).toEqual([]);
      expect(result.rewrites).toEqual([]);
      expect(result.redirects).toEqual([[]]);
      expect(result.iframe).toEqual([{Deny: null}]);
      expect(result.raw_access).toEqual([{Deny: null}]);
      expect(result.version).toEqual([]);
      expect(result.max_memory_size).toEqual([]);
    });

    it('handles empty strings and special characters in redirects', () => {
      const config: StorageConfig = {
        redirects: [{source: '', location: '/new?query=1', code: 301}],
        rewrites: [],
        headers: [],
        iframe: 'same-origin',
        rawAccess: true,
        version: 1n,
        maxMemorySize: {heap: 123n, stable: 456n}
      };

      const result = fromStorageConfig(config);

      expect(result.redirects).toEqual([[['', {location: '/new?query=1', status_code: 301}]]]);
    });
  });

  describe('toStorageConfig', () => {
    it('maps StorageConfigDid correctly', () => {
      const result = toStorageConfig({
        headers: [['/x', [['Cache-Control', 'max-age=3600']]]],
        rewrites: [['/a', '/b']],
        redirects: [[['/old', {location: '/new', status_code: 301}]]],
        iframe: [{AllowAny: null}],
        raw_access: [{Deny: null}],
        version: [2n],
        created_at: [now],
        updated_at: [now],
        max_memory_size: [{heap: [100n], stable: [4444n]}]
      });

      expect(result.iframe).toBe('allow-any');
      expect(result.rawAccess).toBe(false);
      expect(result.version).toBe(2n);
      expect(result.headers).toEqual([
        {source: '/x', headers: [['Cache-Control', 'max-age=3600']]}
      ]);
      expect(result.rewrites).toEqual([{source: '/a', destination: '/b'}]);
      expect(result.redirects).toEqual([{source: '/old', location: '/new', code: 301}]);
      expect(result.maxMemorySize).toEqual({heap: 100n, stable: 4444n});
    });

    it('handles missing optional fields in toStorageConfig', () => {
      const result = toStorageConfig({
        headers: [],
        rewrites: [],
        redirects: [],
        iframe: [],
        raw_access: [],
        max_memory_size: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      expect(result.headers).toBeUndefined();
      expect(result.rewrites).toBeUndefined();
      expect(result.redirects).toBeUndefined();
      expect(result.iframe).toBeUndefined();
      expect(result.rawAccess).toBeUndefined();
      expect(result.maxMemorySize).toBeUndefined();
      expect(result.version).toBeUndefined();
    });
  });

  describe('fromDatastoreConfig', () => {
    it('maps DatastoreConfig correctly', () => {
      const config: DatastoreConfig = {
        version: 3n,
        maxMemorySize: {heap: 5n, stable: 10n}
      };

      const result = fromDatastoreConfig(config);
      expect(result.version).toEqual([3n]);
      expect(result.max_memory_size).toEqual([{heap: [5n], stable: [10n]}]);
    });

    it('handles nullish values in fromDatastoreConfig', () => {
      const result = fromDatastoreConfig({
        maxMemorySize: undefined,
        version: undefined
      });

      expect(result.max_memory_size).toEqual([]);
      expect(result.version).toEqual([]);
    });

    it('handles empty maxMemorySize', () => {
      const result = fromDatastoreConfig({
        maxMemorySize: {heap: 0n, stable: 0n},
        version: 0n
      });

      expect(result.max_memory_size).toEqual([{heap: [0n], stable: [0n]}]);
      expect(result.version).toEqual([0n]);
    });
  });

  describe('toDatastoreConfig', () => {
    it('maps DbConfigDid correctly', () => {
      const result = toDatastoreConfig({
        version: [6n],
        max_memory_size: [{heap: [9n], stable: [11n]}],
        created_at: [now],
        updated_at: [now]
      });

      expect(result.version).toBe(6n);
      expect(result.maxMemorySize).toEqual({heap: 9n, stable: 11n});
    });

    it('handles missing timestamps in toDatastoreConfig', () => {
      const result = toDatastoreConfig({
        version: [],
        max_memory_size: [],
        created_at: [],
        updated_at: []
      });

      expect(result.version).toBeUndefined();
      expect(result.maxMemorySize).toBeUndefined();
    });
  });

  describe('fromAuthenticationConfig', () => {
    it('maps AuthenticationConfig with internet identity and rules', () => {
      const config: AuthenticationConfig = {
        internetIdentity: {
          derivationOrigin: 'https://foo.icp0.io',
          externalAlternativeOrigins: ['https://bar.icp0.io']
        },
        rules: {
          allowedCallers: [mockUserIdText, mockSatelliteIdText]
        },
        version: 7n
      };

      const result = fromAuthenticationConfig(config);

      expect(result.internet_identity).toEqual([
        {
          derivation_origin: ['https://foo.icp0.io'],
          external_alternative_origins: [['https://bar.icp0.io']]
        }
      ]);
      expect(result.rules).toEqual([
        {
          allowed_callers: [
            Principal.fromText(mockUserIdText),
            Principal.fromText(mockSatelliteIdText)
          ]
        }
      ]);
      expect(result.version).toEqual([7n]);
    });

    it('maps google -> openid providers Google', () => {
      const config: AuthenticationConfig = {
        internetIdentity: undefined,
        google: {clientId: '1234567890-abcdef.apps.googleusercontent.com'},
        rules: undefined,
        version: undefined
      };

      const result = fromAuthenticationConfig(config);

      expect(result.openid).toEqual([
        {
          providers: [
            [
              {Google: null},
              {client_id: '1234567890-abcdef.apps.googleusercontent.com', delegation: []}
            ]
          ],
          observatory_id: []
        }
      ]);
    });

    it('omits openid when google is undefined', () => {
      const result = fromAuthenticationConfig({
        internetIdentity: undefined,
        google: undefined,
        rules: undefined,
        version: undefined
      });

      expect(result.openid).toEqual([]);
    });

    it('handles nullish internetIdentity and rules in fromAuthenticationConfig', () => {
      const result = fromAuthenticationConfig({
        internetIdentity: undefined,
        rules: undefined,
        version: undefined
      });

      expect(result.internet_identity).toEqual([]);
      expect(result.rules).toEqual([]);
      expect(result.version).toEqual([]);
    });

    it('handles empty internetIdentity and rules', () => {
      const result = fromAuthenticationConfig({
        internetIdentity: {derivationOrigin: 'hello.com', externalAlternativeOrigins: []},
        rules: {allowedCallers: []},
        version: 0n
      });

      expect(result.internet_identity).toEqual([
        {
          derivation_origin: ['hello.com'],
          external_alternative_origins: [[]]
        }
      ]);
      expect(result.rules).toEqual([{allowed_callers: []}]);
      expect(result.version).toEqual([0n]);
    });

    it('encodes delegation: targets = null (unrestricted)', () => {
      const config: AuthenticationConfig = {
        google: {
          clientId: '1234567890-abcdef.apps.googleusercontent.com',
          delegation: {
            allowedTargets: null
          }
        }
      };

      const result = fromAuthenticationConfig(config);

      expect(result.openid).toEqual([
        {
          providers: [
            [
              {Google: null},
              {
                client_id: '1234567890-abcdef.apps.googleusercontent.com',
                delegation: [
                  {
                    targets: [],
                    max_time_to_live: []
                  }
                ]
              }
            ]
          ],
          observatory_id: []
        }
      ]);
    });

    it('encodes delegation: targets = undefined (default/self)', () => {
      const config: AuthenticationConfig = {
        google: {
          clientId: '1234567890-abcdef.apps.googleusercontent.com',
          delegation: {
            // targets omitted
          }
        }
      };

      const result = fromAuthenticationConfig(config);

      const google = result.openid?.[0]?.providers[0];

      assertNonNullish(google);

      const [_, googleConfig] = google;

      expect(googleConfig.delegation?.[0]?.targets).toEqual([[]]);
      expect(googleConfig.delegation?.[0]?.max_time_to_live).toEqual([]);
    });

    it('encodes delegation: explicit targets', () => {
      const config: AuthenticationConfig = {
        google: {
          clientId: '1234567890-abcdef.apps.googleusercontent.com',
          delegation: {
            allowedTargets: [mockUserIdText, mockSatelliteIdText]
          }
        }
      };

      const result = fromAuthenticationConfig(config);

      const google = result.openid?.[0]?.providers[0];

      assertNonNullish(google);

      const [_, googleConfig] = google;

      expect(googleConfig.delegation?.[0]?.targets?.[0]).toEqual([
        Principal.fromText(mockUserIdText),
        Principal.fromText(mockSatelliteIdText)
      ]);
    });

    it('encodes delegation: maxTimeToLive present', () => {
      const ttl = 24n * 60n * 60n * 1_000_000_000n; // 1 day ns
      const config: AuthenticationConfig = {
        google: {
          clientId: '1234567890-abcdef.apps.googleusercontent.com',
          delegation: {
            allowedTargets: [mockUserIdText],
            sessionDuration: ttl
          }
        }
      };

      const result = fromAuthenticationConfig(config);

      const google = result.openid?.[0]?.providers[0];

      assertNonNullish(google);

      const [_, googleConfig] = google;

      expect(googleConfig.delegation?.[0]?.max_time_to_live).toEqual([ttl]);
    });
  });

  describe('toAuthenticationConfig', () => {
    const mockClientId = '1234567890-abcdef.apps.googleusercontent.com';
    const mockOpenId: SatelliteDid.AuthenticationConfigOpenId = {
      providers: [[{Google: null}, {client_id: mockClientId, delegation: []}]],
      observatory_id: []
    };

    it('maps AuthenticationConfigDid correctly', () => {
      const result = toAuthenticationConfig({
        internet_identity: [
          {
            derivation_origin: ['https://baz.icp0.io'],
            external_alternative_origins: [['https://alt.icp0.io']]
          }
        ],
        openid: [mockOpenId],
        rules: [
          {
            allowed_callers: [
              Principal.fromText(mockUserIdText),
              Principal.fromText(mockSatelliteIdText)
            ]
          }
        ],
        version: [8n],
        created_at: [now],
        updated_at: [now]
      });

      expect(result.internetIdentity).toEqual({
        derivationOrigin: 'https://baz.icp0.io',
        externalAlternativeOrigins: ['https://alt.icp0.io']
      });
      expect(result.google).toEqual({clientId: mockClientId});
      expect(result.rules).toEqual({
        allowedCallers: [mockUserIdText, mockSatelliteIdText]
      });
      expect(result.version).toBe(8n);
    });

    it('handles empty nested fields in toAuthenticationConfig', () => {
      const result = toAuthenticationConfig({
        internet_identity: [],
        openid: [],
        rules: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      expect(result.internetIdentity).toBeUndefined();
      expect(result.google).toBeUndefined();
      expect(result.rules).toBeUndefined();
      expect(result.version).toBeUndefined();
    });

    it('handles empty strings in internetIdentity', () => {
      const result = toAuthenticationConfig({
        internet_identity: [
          {
            derivation_origin: ['aaa.com'],
            external_alternative_origins: [[]]
          }
        ],
        openid: [],
        rules: [
          {
            allowed_callers: []
          }
        ],
        version: [0n],
        created_at: [now],
        updated_at: [now]
      });

      expect(result.internetIdentity).toEqual({
        derivationOrigin: 'aaa.com',
        externalAlternativeOrigins: []
      });
      expect(result.rules).toEqual({
        allowedCallers: []
      });
      expect(result.version).toBe(0n);
    });

    it('maps openid providers (Google) -> google in toAuthenticationConfig', () => {
      const result = toAuthenticationConfig({
        internet_identity: [],
        openid: [mockOpenId],
        rules: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      expect(result.google).toEqual({
        clientId: mockClientId
      });
    });

    it('omits google when openid is empty', () => {
      const result = toAuthenticationConfig({
        internet_identity: [],
        openid: [],
        rules: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      expect(result.google).toBeUndefined();
    });

    it('decodes delegation: targets None -> targets = null (unrestricted)', () => {
      const mockClientId = '1234567890-abcdef.apps.googleusercontent.com';
      const result = toAuthenticationConfig({
        internet_identity: [],
        openid: [
          {
            providers: [
              [
                {Google: null},
                {
                  client_id: mockClientId,
                  delegation: [
                    {
                      targets: [],
                      max_time_to_live: []
                    }
                  ]
                }
              ]
            ],
            observatory_id: []
          }
        ],
        rules: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      expect(result.google?.delegation?.allowedTargets).toBeNull();
      expect(result.google?.delegation?.sessionDuration).toBeUndefined();
    });

    it('decodes delegation: targets Some(empty) -> targets = undefined (default/self)', () => {
      const mockClientId = '1234567890-abcdef.apps.googleusercontent.com';
      const result = toAuthenticationConfig({
        internet_identity: [],
        openid: [
          {
            providers: [
              [
                {Google: null},
                {
                  client_id: mockClientId,
                  delegation: [
                    {
                      targets: [[]],
                      max_time_to_live: []
                    }
                  ]
                }
              ]
            ],
            observatory_id: []
          }
        ],
        rules: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      // delegation omitted entirely because targets=undefined and no TTL
      expect(result.google?.delegation).toBeUndefined();
    });

    it('decodes delegation: explicit targets -> array of text principals', () => {
      const mockClientId = '1234567890-abcdef.apps.googleusercontent.com';
      const result = toAuthenticationConfig({
        internet_identity: [],
        openid: [
          {
            providers: [
              [
                {Google: null},
                {
                  client_id: mockClientId,
                  delegation: [
                    {
                      targets: [
                        [
                          Principal.fromText(mockUserIdText),
                          Principal.fromText(mockSatelliteIdText)
                        ]
                      ],
                      max_time_to_live: []
                    }
                  ]
                }
              ]
            ],
            observatory_id: []
          }
        ],
        rules: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      expect(result.google?.delegation?.allowedTargets).toEqual([
        mockUserIdText,
        mockSatelliteIdText
      ]);
      expect(result.google?.delegation?.sessionDuration).toBeUndefined();
    });

    it('decodes delegation: ttl present -> keeps delegation even if targets undefined', () => {
      const mockClientId = '1234567890-abcdef.apps.googleusercontent.com';
      const ttl = 24n * 60n * 60n * 1_000_000_000n;

      const result = toAuthenticationConfig({
        internet_identity: [],
        openid: [
          {
            providers: [
              [
                {Google: null},
                {
                  client_id: mockClientId,
                  delegation: [
                    {
                      targets: [[]],
                      max_time_to_live: [ttl]
                    }
                  ]
                }
              ]
            ],
            observatory_id: []
          }
        ],
        rules: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      expect(result.google?.delegation?.allowedTargets).toBeUndefined();
      expect(result.google?.delegation?.sessionDuration).toBe(ttl);
    });
  });
});
