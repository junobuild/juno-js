import {
  AssertFnOrObjectSchema,
  AssertSchema,
  AssertSetDoc,
  AssertSetDocSchema,
  defineAssert
} from '../../../hooks/db/assertions';

describe('assert.config', () => {
  const mockAssertSetDoc = vi.fn();

  const mockAssertSetDocConfig: AssertSetDoc = {
    collections: ['users', 'orders'],
    assert: mockAssertSetDoc
  };

  it('should return the same configuration object if given an object', () => {
    const result = defineAssert(mockAssertSetDocConfig);
    expect(result).toBe(mockAssertSetDocConfig);
  });

  describe('defineAssert', () => {
    it('should return the same function if given a function', () => {
      const mockFn = vi.fn(() => mockAssertSetDocConfig);
      const result = defineAssert(mockFn);
      expect(result).toBe(mockFn);
    });

    it('should execute the function and return a configuration when called', () => {
      const mockFn = vi.fn(() => mockAssertSetDocConfig);
      const result = defineAssert(mockFn);
      expect(result({})).toBe(mockAssertSetDocConfig);
    });

    it('should not modify the configuration object', () => {
      const result = defineAssert(mockAssertSetDocConfig);
      expect(result).toEqual(mockAssertSetDocConfig);
    });
  });

  describe('AssertSetDocConfigSchema', () => {
    it('should validate a correct AssertSetDocConfig', () => {
      expect(() => AssertSetDocSchema.parse(mockAssertSetDocConfig)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      const invalidConfig = {...mockAssertSetDocConfig, collections: []};
      expect(() => AssertSetDocSchema.parse(invalidConfig)).not.toThrow();
    });

    it('should reject an invalid assert function', () => {
      const invalidConfig = {...mockAssertSetDocConfig, assert: 'not a function'};
      expect(() => AssertSetDocSchema.parse(invalidConfig)).toThrow();
    });

    it('should reject unknown fields due to .strict()', () => {
      const invalidConfig = {...mockAssertSetDocConfig, extraField: 'not allowed'};
      expect(() => AssertSetDocSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('AssertConfigSchema', () => {
    it('should validate a correct AssertConfig', () => {
      expect(() => AssertSchema.parse(mockAssertSetDocConfig)).not.toThrow();
    });

    it('should reject an unknown field', () => {
      const invalidAssertConfig = {...mockAssertSetDocConfig, invalidField: 'not allowed'};
      expect(() => AssertSchema.parse(invalidAssertConfig)).toThrow();
    });
  });

  describe('AssertFnOrObjectSchema', () => {
    const validAssertFn = () => mockAssertSetDocConfig;

    it('should validate a correct Assert function', () => {
      expect(() => AssertFnOrObjectSchema(AssertSchema).parse(validAssertFn)).not.toThrow();
    });

    it('should validate a correct Assert object', () => {
      expect(() =>
        AssertFnOrObjectSchema(AssertSchema).parse(mockAssertSetDocConfig)
      ).not.toThrow();
    });

    it('should reject an invalid Assert object with unknown fields', () => {
      const invalidObjectAssert = {...mockAssertSetDocConfig, invalidField: 'extra'};
      expect(() => AssertFnOrObjectSchema(AssertSchema).parse(invalidObjectAssert)).toThrow();
    });
  });
});
