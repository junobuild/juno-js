import {Principal} from '@dfinity/principal';
import type {
  AuthenticationConfig,
  DatastoreConfig,
  StorageConfig,
  StorageConfigHeader,
  StorageConfigRedirect,
  StorageConfigRewrite
} from '@junobuild/config';
import {describe, expect, it} from 'vitest';
import {
  fromAuthenticationConfig,
  fromDatastoreConfig,
  fromStorageConfig,
  toAuthenticationConfig,
  toDatastoreConfig,
  toStorageConfig
} from '../../utils/config.utils';
import {mockModuleIdText, mockUserIdText} from '../mocks/principal.mocks';

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
        },
        createdAt: now,
        updatedAt: now
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
      expect(result.createdAt).toBe(now);
      expect(result.updatedAt).toBe(now);
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

      expect(result.headers).toBeUndefined()
      expect(result.rewrites).toBeUndefined()
      expect(result.redirects).toBeUndefined();
      expect(result.iframe).toBeUndefined();
      expect(result.rawAccess).toBeUndefined();
      expect(result.maxMemorySize).toBeUndefined()
      expect(result.version).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });
  });

  describe('fromDatastoreConfig', () => {
    it('maps DatastoreConfig correctly', () => {
      const config: DatastoreConfig = {
        version: 3n,
        maxMemorySize: {heap: 5n, stable: 10n},
        createdAt: now,
        updatedAt: now
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
      expect(result.createdAt).toBe(now);
      expect(result.updatedAt).toBe(now);
    });

    it('handles missing timestamps in toDatastoreConfig', () => {
      const result = toDatastoreConfig({
        version: [],
        max_memory_size: [],
        created_at: [],
        updated_at: []
      });

      expect(result.version).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
      expect(result.maxMemorySize).toEqual({});
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
          allowedCallers: [mockUserIdText, mockModuleIdText]
        },
        version: 7n,
        createdAt: now,
        updatedAt: now
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
            Principal.fromText(mockModuleIdText)
          ]
        }
      ]);
      expect(result.version).toEqual([7n]);
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
  });

  describe('toAuthenticationConfig', () => {
    it('maps AuthenticationConfigDid correctly', () => {
      const result = toAuthenticationConfig({
        internet_identity: [
          {
            derivation_origin: ['https://baz.icp0.io'],
            external_alternative_origins: [['https://alt.icp0.io']]
          }
        ],
        rules: [
          {
            allowed_callers: [
              Principal.fromText(mockUserIdText),
              Principal.fromText(mockModuleIdText)
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
      expect(result.rules).toEqual({
        allowedCallers: [mockUserIdText, mockModuleIdText]
      });
      expect(result.version).toBe(8n);
      expect(result.createdAt).toBe(now);
      expect(result.updatedAt).toBe(now);
    });

    it('handles empty nested fields in toAuthenticationConfig', () => {
      const result = toAuthenticationConfig({
        internet_identity: [],
        rules: [],
        version: [],
        created_at: [],
        updated_at: []
      });

      expect(result.internetIdentity).toBeUndefined();
      expect(result.rules).toBeUndefined();
      expect(result.version).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });
  });
});
