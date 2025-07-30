import type {Rule} from '@junobuild/config';
import type {Rule as RuleApi} from '../../../declarations/satellite/satellite.did';
import {
  DbRulesType,
  DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS,
  MemoryHeap,
  MemoryStable,
  StorageRulesType
} from '../../constants/rules.constants';
import {
  mapRule,
  mapRulesFilter,
  mapRuleType,
  mapSetRule,
  memoryFromText,
  memoryToText,
  permissionToText
} from '../../utils/rule.utils';

describe('rules.utils', () => {
  describe('mapRuleType', () => {
    it('returns DbRulesType when type is "db"', () => {
      expect(mapRuleType('db')).toEqual(DbRulesType);
    });

    it('returns StorageRulesType when type is "storage"', () => {
      expect(mapRuleType('storage')).toEqual(StorageRulesType);
    });
  });

  describe('mapRulesFilter', () => {
    it('returns null matcher when filter is undefined', () => {
      expect(mapRulesFilter()).toEqual({matcher: []});
    });

    it('returns matcher with include_system when provided', () => {
      expect(mapRulesFilter({include_system: true})).toEqual({
        matcher: [{include_system: true}]
      });
    });
  });

  describe('mapSetRule', () => {
    it('maps full rule to SetRule', () => {
      const input: Pick<
        Rule,
        | 'read'
        | 'write'
        | 'maxSize'
        | 'maxChangesPerUser'
        | 'maxCapacity'
        | 'version'
        | 'memory'
        | 'mutablePermissions'
        | 'maxTokens'
      > = {
        read: 'public',
        write: 'private',
        memory: 'heap',
        maxSize: 100,
        maxChangesPerUser: 10,
        maxCapacity: 50,
        version: 1n,
        mutablePermissions: true,
        maxTokens: 20
      };

      const result = mapSetRule(input);
      expect(result).toEqual({
        read: {Public: null},
        write: {Private: null},
        memory: [{Heap: null}],
        version: [1n],
        max_size: [BigInt(100)],
        max_capacity: [50],
        max_changes_per_user: [10],
        mutable_permissions: [true],
        rate_config: [
          {
            max_tokens: BigInt(20),
            time_per_token_ns: DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS
          }
        ]
      });
    });

    it('omits optional fields when undefined or invalid', () => {
      const result = mapSetRule({
        read: 'public',
        write: 'private',
        memory: 'heap',
        mutablePermissions: true,
        version: undefined,
        maxTokens: undefined,
        maxSize: 0,
        maxChangesPerUser: 0,
        maxCapacity: 0
      });

      expect(result.memory).toEqual([{Heap: null}]);
      expect(result.version).toEqual([]);
      expect(result.mutable_permissions).toEqual([true]);
      expect(result.max_size).toEqual([]);
      expect(result.max_capacity).toEqual([]);
      expect(result.max_changes_per_user).toEqual([]);
      expect(result.rate_config).toEqual([]);
    });

    it.each([
      ['public', {Public: null}],
      ['private', {Private: null}],
      ['managed', {Managed: null}],
      ['controllers', {Controllers: null}]
    ] as const)(
      'maps read/write "%s" to correct Permission variant',
      (text, expectedPermission) => {
        const result = mapSetRule({
          read: text,
          write: text,
          memory: 'heap',
          mutablePermissions: true,
          version: undefined,
          maxTokens: undefined,
          maxSize: 0,
          maxChangesPerUser: 0,
          maxCapacity: 0
        });

        expect(result.read).toEqual(expectedPermission);
        expect(result.write).toEqual(expectedPermission);
      }
    );
  });

  describe('mapRule', () => {
    it('maps RuleApi to Rule with all fields', () => {
      const input: [string, RuleApi] = [
        'test',
        {
          read: {Public: null},
          write: {Private: null},
          created_at: 1n,
          updated_at: 2n,
          memory: [{Heap: null}],
          version: [3n],
          max_capacity: [100],
          max_size: [1000n],
          max_changes_per_user: [5],
          mutable_permissions: [false],
          rate_config: [
            {
              max_tokens: 50n,
              time_per_token_ns: DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS
            }
          ]
        }
      ];

      const result = mapRule(input);
      expect(result).toEqual({
        collection: 'test',
        read: 'public',
        write: 'private',
        memory: 'heap',
        createdAt: 1n,
        updatedAt: 2n,
        version: 3n,
        maxCapacity: 100,
        maxSize: 1000,
        maxChangesPerUser: 5,
        mutablePermissions: false,
        maxTokens: 50
      });
    });
  });

  describe('permissionToText', () => {
    it('maps Permission to correct text', () => {
      expect(permissionToText({Public: null})).toBe('public');
      expect(permissionToText({Private: null})).toBe('private');
      expect(permissionToText({Managed: null})).toBe('managed');
      expect(permissionToText({Controllers: null})).toBe('controllers');
    });
  });

  describe('memoryFromText', () => {
    it('returns MemoryHeap when text is "heap"', () => {
      expect(memoryFromText('heap')).toEqual(MemoryHeap);
    });

    it('returns MemoryStable otherwise', () => {
      expect(memoryFromText('stable')).toEqual(MemoryStable);
    });
  });

  describe('memoryToText', () => {
    it('returns "heap" for Heap memory', () => {
      expect(memoryToText({Heap: null})).toBe('heap');
    });

    it('returns "stable" for Stable memory', () => {
      expect(memoryToText({Stable: null})).toBe('stable');
    });
  });
});
