import {Principal} from '@dfinity/principal';
import {
  defineHook,
  HookConfigSchema,
  HookFnOrObjectSchema,
  OnSetDocConfig,
  OnSetDocConfigSchema
} from '../../configs/hook.config';
import type {DocUpsert} from '../../hooks/datastore';

describe('hook.config', () => {
  const mockOnSetDoc = vi.fn(async () => {});

  const mockOnSetDocConfig: OnSetDocConfig = {
    collections: ['products', 'transactions'],
    run: mockOnSetDoc
  };

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
      expect(mockOnSetDoc).toHaveBeenCalled();
    });
  });

  describe('OnSetDocConfigSchema', () => {
    it('should validate a correct OnSetDocConfig', () => {
      expect(() => OnSetDocConfigSchema.parse(mockOnSetDocConfig)).not.toThrow();
    });

    it('should reject an empty collections array', () => {
      const invalidConfig = { ...mockOnSetDocConfig, collections: [] };
      expect(() => OnSetDocConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should reject an invalid run function', () => {
      const invalidConfig = { ...mockOnSetDocConfig, run: "not a function" };
      expect(() => OnSetDocConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should reject unknown fields due to .strict()', () => {
      const invalidConfig = { ...mockOnSetDocConfig, extraField: "not allowed" };
      expect(() => OnSetDocConfigSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('HookConfigSchema', () => {
    it('should validate a correct HookConfig', () => {
      expect(() => HookConfigSchema.parse(mockOnSetDocConfig)).not.toThrow();
    });

    it('should reject an unknown field', () => {
      const invalidHookConfig = { ...mockOnSetDocConfig, invalidField: "not allowed" };
      expect(() => HookConfigSchema.parse(invalidHookConfig)).toThrow();
    });
  });

  describe('HookFnOrObjectSchema', () => {
    const validHookFn = () => (mockOnSetDocConfig);

    it('should validate a correct Hook function', () => {
      expect(() => HookFnOrObjectSchema(HookConfigSchema).parse(validHookFn)).not.toThrow();
    });

    it('should validate a correct Hook object', () => {
      expect(() => HookFnOrObjectSchema(HookConfigSchema).parse(mockOnSetDocConfig)).not.toThrow();
    });

    it('should reject an invalid Hook object with unknown fields', () => {
      const invalidObjectHook = { ...mockOnSetDocConfig, invalidField: "extra" };
      expect(() => HookFnOrObjectSchema(HookConfigSchema).parse(invalidObjectHook)).toThrow();
    });
  });

});
