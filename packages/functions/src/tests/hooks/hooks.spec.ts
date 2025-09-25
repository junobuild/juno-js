import {Principal} from '@dfinity/principal';
import {
  defineHook,
  HookFnOrObjectSchema,
  HookSchema,
  OnDeleteAssetSchema,
  OnDeleteDocSchema,
  OnDeleteFilteredAssetsSchema,
  OnDeleteFilteredDocsSchema,
  OnDeleteManyAssetsSchema,
  OnDeleteManyDocsSchema,
  OnSetDoc,
  OnSetDocSchema,
  OnSetManyDocs,
  OnSetManyDocsSchema,
  OnUploadAssetSchema
} from '../../hooks/hooks';
import type {DocUpsert} from '../../hooks/schemas/db/payload';

describe('hooks', () => {
  const mockFn = vi.fn(async (_ctx: unknown) => {});

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

  const baseAsset = {
    key: {
      name: 'logo.png',
      full_path: '/images/logo.png',
      collection: 'assets',
      owner: new Uint8Array([1, 2, 3])
    },
    headers: [],
    encodings: [],
    created_at: 1700000000000000n,
    updated_at: 1700000000000001n
  };

  describe('OnSetDocSchema', () => {
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

  describe('OnSetManyDocsSchema', () => {
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
      OnSetManyDocsSchema.parse(mockOnSetManyDocsConfig);

      await mockOnSetManyDocsConfig.run({
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
      OnDeleteDocSchema.parse(config);
      await config.run({
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
      OnDeleteManyDocsSchema.parse(config);
      await config.run({
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
      OnDeleteFilteredDocsSchema.parse(config);
      await config.run({
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

  describe('HookSchema', () => {
    const mockFn = vi.fn();

    const validHookConfigs = [
      ['OnSetDoc', {collections: ['docs'], run: mockFn}],
      ['OnSetManyDocs', {collections: ['docs'], run: mockFn}],
      ['OnDeleteDoc', {collections: ['docs'], run: mockFn}],
      ['OnDeleteManyDocs', {collections: ['docs'], run: mockFn}],
      ['OnDeleteFilteredDocs', {collections: ['docs'], run: mockFn}],
      ['OnUploadAsset', {collections: ['assets'], run: mockFn}],
      ['OnDeleteAsset', {collections: ['assets'], run: mockFn}],
      ['OnDeleteManyAssets', {collections: ['assets'], run: mockFn}],
      ['OnDeleteFilteredAssets', {collections: ['assets'], run: mockFn}]
    ] as const;

    it.each(validHookConfigs)('should validate %s config', (_, config) => {
      expect(() => HookSchema.parse(config)).not.toThrow();
    });

    const invalidConfigs: [string, unknown][] = [
      ['unknown field', {collections: ['docs'], run: mockFn, unknown: 'nope'}],
      ['invalid run type', {collections: ['docs'], run: 'not-a-fn'}]
    ];

    it.each(invalidConfigs)('should reject config with %s', (_, config) => {
      expect(() => HookSchema.parse(config)).toThrow();
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

  describe('OnUploadAssetSchema', () => {
    const config = {collections: ['assets'], run: mockFn};

    it('should validate a correct OnUploadAsset config', () => {
      expect(() => OnUploadAssetSchema.parse(config)).not.toThrow();
    });

    it('should call run when executed', async () => {
      OnUploadAssetSchema.parse(config);
      await config.run({
        caller: Principal.anonymous().toUint8Array(),
        data: baseAsset
      });
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('OnDeleteAssetSchema', () => {
    const config = {collections: ['assets'], run: mockFn};

    it('should validate a correct OnDeleteAsset config', () => {
      expect(() => OnDeleteAssetSchema.parse(config)).not.toThrow();
    });

    it('should call run when executed with undefined data', async () => {
      OnDeleteAssetSchema.parse(config);
      await config.run({
        caller: Principal.anonymous().toUint8Array(),
        data: undefined
      });
      expect(mockFn).toHaveBeenCalled();
    });

    it('should call run when executed with asset data', async () => {
      OnDeleteAssetSchema.parse(config);
      await config.run({
        caller: Principal.anonymous().toUint8Array(),
        data: baseAsset
      });
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('OnDeleteManyAssetsSchema', () => {
    const config = {collections: ['assets'], run: mockFn};

    it('should validate a correct OnDeleteManyAssets config', () => {
      expect(() => OnDeleteManyAssetsSchema.parse(config)).not.toThrow();
    });

    it('should call run with a mix of undefined and asset data', async () => {
      OnDeleteManyAssetsSchema.parse(config);
      await config.run({
        caller: Principal.anonymous().toUint8Array(),
        data: [undefined, baseAsset]
      });
      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('OnDeleteFilteredAssetsSchema', () => {
    const config = {collections: ['assets'], run: mockFn};

    it('should validate a correct OnDeleteFilteredAssets config', () => {
      expect(() => OnDeleteFilteredAssetsSchema.parse(config)).not.toThrow();
    });

    it('should call run with filtered assets', async () => {
      OnDeleteFilteredAssetsSchema.parse(config);
      await config.run({
        caller: Principal.anonymous().toUint8Array(),
        data: [baseAsset, undefined]
      });
      expect(mockFn).toHaveBeenCalled();
    });
  });
});
