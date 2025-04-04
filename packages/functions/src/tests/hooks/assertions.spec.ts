import {
  AssertDeleteAssetSchema,
  AssertDeleteDocSchema,
  AssertFnOrObjectSchema,
  AssertSchema,
  AssertSetDoc,
  AssertSetDocSchema,
  AssertUploadAssetSchema,
  defineAssert
} from '../../hooks/assertions';

describe('assertions', () => {
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

  describe('AssertDeleteDocSchema', () => {
    const mockAssertDeleteDoc = vi.fn();

    const mockAssertDeleteDocConfig = {
      collections: ['posts', 'logs'],
      assert: mockAssertDeleteDoc
    };

    it('should validate a valid AssertDeleteDoc config', () => {
      expect(() => AssertDeleteDocSchema.parse(mockAssertDeleteDocConfig)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      const validConfig = {...mockAssertDeleteDocConfig, collections: []};
      expect(() => AssertDeleteDocSchema.parse(validConfig)).not.toThrow();
    });

    it('should reject if assert is not a function', () => {
      const invalidConfig = {...mockAssertDeleteDocConfig, assert: 'not-a-function'};
      expect(() => AssertDeleteDocSchema.parse(invalidConfig)).toThrow();
    });

    it('should reject unknown fields due to .strict()', () => {
      const invalidConfig = {...mockAssertDeleteDocConfig, extraField: true};
      expect(() => AssertDeleteDocSchema.parse(invalidConfig)).toThrow();
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

  describe('AssertSchema', () => {
    const mockAssertSet = vi.fn();
    const mockAssertDelete = vi.fn();
    const mockAssertUpload = vi.fn();
    const mockAssertDeleteAsset = vi.fn();

    const validSetConfig = {
      collections: ['users'],
      assert: mockAssertSet
    };

    const validDeleteConfig = {
      collections: ['docs'],
      assert: mockAssertDelete
    };

    const validUploadAssetConfig = {
      collections: ['media'],
      assert: mockAssertUpload
    };

    const validDeleteAssetConfig = {
      collections: ['media'],
      assert: mockAssertDeleteAsset
    };

    it('should validate a valid AssertSetDoc config', () => {
      expect(() => AssertSchema.parse(validSetConfig)).not.toThrow();
    });

    it('should validate a valid AssertDeleteDoc config', () => {
      expect(() => AssertSchema.parse(validDeleteConfig)).not.toThrow();
    });

    it('should validate a valid AssertUploadAsset config', () => {
      expect(() => AssertSchema.parse(validUploadAssetConfig)).not.toThrow();
    });

    it('should validate a valid AssertDeleteAsset config', () => {
      expect(() => AssertSchema.parse(validDeleteAssetConfig)).not.toThrow();
    });

    it('should reject unknown fields in either config', () => {
      const invalid = {
        collections: ['x'],
        assert: mockAssertSet,
        extra: 'nope'
      };
      expect(() => AssertSchema.parse(invalid)).toThrow();
    });
  });

  describe('AssertUploadAssetSchema', () => {
    const mockAssertUpload = vi.fn();

    const validUploadConfig = {
      collections: ['media', 'static'],
      assert: mockAssertUpload
    };

    it('should validate a valid AssertUploadAsset config', () => {
      expect(() => AssertUploadAssetSchema.parse(validUploadConfig)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      const validEmptyCollections = {...validUploadConfig, collections: []};
      expect(() => AssertUploadAssetSchema.parse(validEmptyCollections)).not.toThrow();
    });

    it('should reject if assert is not a function', () => {
      const invalid = {...validUploadConfig, assert: 'not-a-function'};
      expect(() => AssertUploadAssetSchema.parse(invalid)).toThrow();
    });

    it('should reject unknown fields', () => {
      const invalid = {...validUploadConfig, extra: 'not allowed'};
      expect(() => AssertUploadAssetSchema.parse(invalid)).toThrow();
    });
  });

  describe('AssertDeleteAssetSchema', () => {
    const mockAssertDelete = vi.fn();

    const validDeleteConfig = {
      collections: ['assets'],
      assert: mockAssertDelete
    };

    it('should validate a valid AssertDeleteAsset config', () => {
      expect(() => AssertDeleteAssetSchema.parse(validDeleteConfig)).not.toThrow();
    });

    it('should accept an empty collections array', () => {
      const validEmptyCollections = {...validDeleteConfig, collections: []};
      expect(() => AssertDeleteAssetSchema.parse(validEmptyCollections)).not.toThrow();
    });

    it('should reject if assert is not a function', () => {
      const invalid = {...validDeleteConfig, assert: 123};
      expect(() => AssertDeleteAssetSchema.parse(invalid)).toThrow();
    });

    it('should reject unknown fields', () => {
      const invalid = {...validDeleteConfig, unexpected: true};
      expect(() => AssertDeleteAssetSchema.parse(invalid)).toThrow();
    });
  });
});
