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
import {mockModuleIdText, mockUserIdText} from '../mocks/principal.mocks';
import {
  fromAuthenticationConfig,
  fromDatastoreConfig,
  fromStorageConfig, toAuthenticationConfig,
  toDatastoreConfig,
  toStorageConfig
} from '../../utils/config.utils';

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
      expect(result.maxMemorySize).toEqual({heap: 100n});
      expect(result.maxMemorySize).toEqual({stable: 4444n});
      expect(result.createdAt).toBe(now);
      expect(result.updatedAt).toBe(now);
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
  });

  describe('toDatastoreConfig', () => {
    it('maps DbConfigDid correctly', () => {
      const result = toDatastoreConfig({
        version: [6n],
        max_memory_size: [{heap: [9n], stable: [11n]}],
        created_at: [now],
        updated_at: [now]
      });

      expect(result.version).toBe(5n);
      expect(result.maxMemorySize).toEqual({heap: 9n, stable: 11n});
      expect(result.createdAt).toBe(now);
      expect(result.updatedAt).toBe(now);
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
  });
});
