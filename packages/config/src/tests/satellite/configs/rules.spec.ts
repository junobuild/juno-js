import {
  MemoryTextSchema,
  PermissionTextSchema,
  RuleSchema,
  RulesTypeSchema
} from '../../../satellite/configs/rules';

describe('rules', () => {
  describe('PermissionTextSchema', () => {
    it('accepts valid permission values', () => {
      for (const value of ['public', 'private', 'managed', 'controllers']) {
        expect(PermissionTextSchema.parse(value)).toBe(value);
      }
    });

    it('rejects invalid permission value', () => {
      expect(() => PermissionTextSchema.parse('admin')).toThrow();
    });
  });

  describe('MemoryTextSchema', () => {
    it('accepts "heap" and "stable"', () => {
      expect(MemoryTextSchema.parse('heap')).toBe('heap');
      expect(MemoryTextSchema.parse('stable')).toBe('stable');
    });

    it('rejects invalid memory value', () => {
      expect(() => MemoryTextSchema.parse('temp')).toThrow();
    });
  });

  describe('RulesTypeSchema', () => {
    it('accepts "db" and "storage"', () => {
      expect(RulesTypeSchema.parse('db')).toBe('db');
      expect(RulesTypeSchema.parse('storage')).toBe('storage');
    });

    it('rejects invalid rule type', () => {
      expect(() => RulesTypeSchema.parse('blob')).toThrow();
    });
  });

  describe('RuleSchema', () => {
    const validRule = {
      collection: 'posts',
      read: 'public',
      write: 'private',
      memory: 'heap',
      mutablePermissions: true,
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
      version: BigInt(1),
      maxSize: 1024 * 1024,
      maxChangesPerUser: 100,
      maxCapacity: 5000,
      maxTokens: 60
    };

    it('accepts a full valid rule object', () => {
      const result = RuleSchema.safeParse(validRule);
      expect(result.success).toBe(true);
    });

    it('accepts a minimal valid rule', () => {
      const result = RuleSchema.safeParse({
        collection: 'users',
        read: 'controllers',
        write: 'controllers',
        memory: 'stable',
        mutablePermissions: false
      });
      expect(result.success).toBe(true);
    });

    it('rejects unknown keys', () => {
      const result = RuleSchema.safeParse({
        ...validRule,
        unknownField: 'not allowed'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('unrecognized_keys');
      }
    });

    it('rejects wrong enum value', () => {
      const result = RuleSchema.safeParse({
        ...validRule,
        read: 'everyone'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['read']);
      }
    });

    it('rejects wrong type (string instead of bigint)', () => {
      const result = RuleSchema.safeParse({
        ...validRule,
        version: '1'
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['version']);
      }
    });
  });
});
