import {Principal} from '@dfinity/principal';
import {
  defineHook,
  HookFnOrObjectSchema,
  HookSchema,
  OnDeleteDocSchema,
  OnDeleteFilteredDocsSchema,
  OnDeleteManyDocsSchema,
  OnSetDoc,
  OnSetDocSchema,
  OnSetManyDocs,
  OnSetManyDocsSchema
} from '../../hooks/hooks';
import type {DocUpsert} from '../../hooks/schemas/db/payload';

describe('hook.config', () => {
  const mockFn = vi.fn(async () => {});

  const mockOnSetDocConfig: OnSetDoc = {
    collections: ['products', 'transactions'],
    run: mockFn
  };

  const baseDoc = {
    collection: 'products',
    key: 'doc-001',
    data: {
      owner: new Uint8Array([1, 2, 3]),
      data: new Uint8Array([4, 5, 6]),
      created_at: 1700000000000000n,
      updated_at: 1700000000000001n
    }
  };

  describe('OnSetDocConfigSchema', () => {
    it('should validate a correct OnSetDocConfig', () => {
      expect(() => OnSetDocSchema.parse(mockOnSetDocConfig)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      const invalidConfig = {...mockOnSetDocConfig, collections: []};
      expect(() => OnSetDocSchema.parse(invalidConfig)).not.toThrow();
    });

    it('should reject an invalid run function', () => {
      const invalidConfig = {...mockOnSetDocConfig, run: 'not a function'};
      expect(() => OnSetDocSchema.parse(invalidConfig)).toThrow();
    });

    it('should reject unknown fields due to .strict()', () => {
      const invalidConfig = {...mockOnSetDocConfig, extraField: 'not allowed'};
      expect(() => OnSetDocSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('OnSetManyDocsConfigSchema', () => {
    const mockOnSetManyDocs = vi.fn(async () => {});

    const mockOnSetManyDocsConfig: OnSetManyDocs = {
      collections: ['products'],
      run: mockOnSetManyDocs
    };

    it('should validate a correct OnSetManyDocsConfig', () => {
      expect(() => OnSetManyDocsSchema.parse(mockOnSetManyDocsConfig)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      const config = {...mockOnSetManyDocsConfig, collections: []};
      expect(() => OnSetManyDocsSchema.parse(config)).not.toThrow();
    });

    it('should reject an invalid run function', () => {
      const invalidConfig = {...mockOnSetManyDocsConfig, run: 'invalid'};
      expect(() => OnSetManyDocsSchema.parse(invalidConfig)).toThrow();
    });

    it('should reject unknown fields due to .strict()', () => {
      const invalidConfig = {...mockOnSetManyDocsConfig, extra: 'nope'};
      expect(() => OnSetManyDocsSchema.parse(invalidConfig)).toThrow();
    });

    it('should call onSetManyDocs function when invoked', async () => {
      const config = OnSetManyDocsSchema.parse(mockOnSetManyDocsConfig);

      await config.run({
        caller: Principal.anonymous().toUint8Array(),
        data: [
          {
            collection: 'products',
            key: 'doc-123',
            data: {
              before: undefined,
              after: {
                owner: new Uint8Array([1, 2, 3]),
                data: new Uint8Array([4, 5, 6]),
                created_at: 1700000000000000n,
                updated_at: 1700000000000001n
              }
            }
          }
        ]
      });

      expect(mockOnSetManyDocs).toHaveBeenCalled();
    });
  });

  describe('OnDeleteDocSchema', () => {
    const config = {
      collections: ['products'],
      run: mockFn
    };

    it('should validate a correct OnDeleteDoc config', () => {
      expect(() => OnDeleteDocSchema.parse(config)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      expect(() => OnDeleteDocSchema.parse({...config, collections: []})).not.toThrow();
    });

    it('should reject invalid run function', () => {
      expect(() => OnDeleteDocSchema.parse({...config, run: 'invalid'})).toThrow();
    });

    it('should reject unknown fields', () => {
      expect(() => OnDeleteDocSchema.parse({...config, extra: 'nope'})).toThrow();
    });

    it('should call run when executed', async () => {
      const parsed = OnDeleteDocSchema.parse(config);
      await parsed.run({
        caller: Principal.anonymous().toUint8Array(),
        data: {...baseDoc, data: undefined}
      });
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('OnDeleteManyDocsSchema', () => {
    const config = {
      collections: ['products'],
      run: mockFn
    };

    it('should validate a correct OnDeleteManyDocs config', () => {
      expect(() => OnDeleteManyDocsSchema.parse(config)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      expect(() => OnDeleteManyDocsSchema.parse({...config, collections: []})).not.toThrow();
    });

    it('should reject invalid run function', () => {
      expect(() => OnDeleteManyDocsSchema.parse({...config, run: 123})).toThrow();
    });

    it('should reject unknown fields', () => {
      expect(() => OnDeleteManyDocsSchema.parse({...config, unknown: true})).toThrow();
    });

    it('should call run when executed', async () => {
      const parsed = OnDeleteManyDocsSchema.parse(config);
      await parsed.run({
        caller: Principal.anonymous().toUint8Array(),
        data: [{...baseDoc, data: undefined}]
      });
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('OnDeleteFilteredDocsSchema', () => {
    const config = {
      collections: ['products'],
      run: mockFn
    };

    it('should validate a correct OnDeleteFilteredDocs config', () => {
      expect(() => OnDeleteFilteredDocsSchema.parse(config)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      expect(() => OnDeleteFilteredDocsSchema.parse({...config, collections: []})).not.toThrow();
    });

    it('should reject invalid run function', () => {
      expect(() => OnDeleteFilteredDocsSchema.parse({...config, run: null})).toThrow();
    });

    it('should reject unknown fields', () => {
      expect(() => OnDeleteFilteredDocsSchema.parse({...config, extra: 'invalid'})).toThrow();
    });

    it('should call run when executed', async () => {
      const parsed = OnDeleteFilteredDocsSchema.parse(config);
      await parsed.run({
        caller: Principal.anonymous().toUint8Array(),
        data: [{...baseDoc, data: undefined}]
      });
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('defineHook', () => {
    it('should return the same configuration object if given an object', () => {
      const result = defineHook(mockOnSetDocConfig);
      expect(result).toBe(mockOnSetDocConfig);
    });

    it('should return the same function if given a function', () => {
      const mockFn = vi.fn(() => mockOnSetDocConfig);
      const result = defineHook(mockFn);
      expect(result).toBe(mockFn);
    });

    it('should execute the function and return a configuration when called', () => {
      const mockFn = vi.fn(() => mockOnSetDocConfig);
      const result = defineHook(mockFn);
      expect(result({})).toBe(mockOnSetDocConfig);
    });

    it('should not modify the configuration object', () => {
      const result = defineHook(mockOnSetDocConfig);
      expect(result).toEqual(mockOnSetDocConfig);
    });

    it('should call onSetDoc function when invoked', async () => {
      const result = defineHook(mockOnSetDocConfig);
      await result.run({
        caller: Principal.anonymous().toUint8Array(),
        data: {collection: 'products', key: '123', data: {} as unknown as DocUpsert}
      });
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('HookConfigSchema', () => {
    it('should validate a correct HookConfig', () => {
      expect(() => HookSchema.parse(mockOnSetDocConfig)).not.toThrow();
    });

    it('should reject an unknown field', () => {
      const invalidHookConfig = {...mockOnSetDocConfig, invalidField: 'not allowed'};
      expect(() => HookSchema.parse(invalidHookConfig)).toThrow();
    });
  });

  describe('HookFnOrObjectSchema', () => {
    const validHookFn = () => mockOnSetDocConfig;

    it('should validate a correct Hook function', () => {
      expect(() => HookFnOrObjectSchema(HookSchema).parse(validHookFn)).not.toThrow();
    });

    it('should validate a correct Hook object', () => {
      expect(() => HookFnOrObjectSchema(HookSchema).parse(mockOnSetDocConfig)).not.toThrow();
    });

    it('should reject an invalid Hook object with unknown fields', () => {
      const invalidObjectHook = {...mockOnSetDocConfig, invalidField: 'extra'};
      expect(() => HookFnOrObjectSchema(HookSchema).parse(invalidObjectHook)).toThrow();
    });
  });
});
