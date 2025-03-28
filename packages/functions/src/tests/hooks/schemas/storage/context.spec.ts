import {
  AssertDeleteAssetContextSchema,
  AssertUploadAssetContextSchema,
  OnDeleteAssetContextSchema,
  OnDeleteFilteredAssetsContextSchema,
  OnDeleteManyAssetsContextSchema,
  OnUploadAssetContextSchema
} from '../../../../hooks/schemas/storage/context';

describe('context', () => {
  const baseAsset = {
    key: {
      name: 'logo.png',
      full_path: '/images/logo.png',
      token: 'abc123',
      collection: 'assets',
      owner: new Uint8Array([1, 2, 3]),
      description: 'Site logo'
    },
    headers: [['Content-Type', 'image/png']],
    encodings: {
      identity: {
        modified: 1700000000000000n,
        content_chunks: [new Uint8Array([1, 2, 3])],
        total_length: 3n,
        sha256: new Uint8Array(32)
      }
    },
    created_at: 1700000000000000n,
    updated_at: 1700000000000001n
  };

  const baseContext = {
    caller: new Uint8Array([9, 8, 7])
  };

  describe('OnUploadAssetContextSchema', () => {
    it('should validate a valid OnUploadAssetContext', () => {
      const context = {
        ...baseContext,
        data: baseAsset
      };
      expect(() => OnUploadAssetContextSchema.parse(context)).not.toThrow();
    });

    it('should reject if unknown fields are present', () => {
      const context = {
        ...baseContext,
        data: baseAsset,
        extra: 'not allowed'
      };
      expect(() => OnUploadAssetContextSchema.parse(context)).toThrow();
    });
  });

  describe('OnDeleteAssetContextSchema', () => {
    it('should validate with existing asset', () => {
      const context = {
        ...baseContext,
        data: baseAsset
      };
      expect(() => OnDeleteAssetContextSchema.parse(context)).not.toThrow();
    });

    it('should validate with undefined asset', () => {
      const context = {
        ...baseContext,
        data: undefined
      };
      expect(() => OnDeleteAssetContextSchema.parse(context)).not.toThrow();
    });
  });

  describe('OnDeleteManyAssetsContextSchema', () => {
    it('should validate with a mix of assets and undefined', () => {
      const context = {
        ...baseContext,
        data: [baseAsset, undefined]
      };
      expect(() => OnDeleteManyAssetsContextSchema.parse(context)).not.toThrow();
    });

    it('should reject if asset is missing required fields', () => {
      const invalidAsset = {
        ...baseAsset,
        created_at: 'not-a-bigint'
      };
      const context = {
        ...baseContext,
        data: [invalidAsset]
      };
      expect(() => OnDeleteManyAssetsContextSchema.parse(context)).toThrow();
    });
  });

  describe('OnDeleteFilteredAssetsContextSchema', () => {
    it('should validate with valid array of assets', () => {
      const context = {
        ...baseContext,
        data: [baseAsset, undefined]
      };
      expect(() => OnDeleteFilteredAssetsContextSchema.parse(context)).not.toThrow();
    });

    it('should reject if unknown field is present', () => {
      const context = {
        ...baseContext,
        data: [baseAsset],
        unknown: true
      };
      expect(() => OnDeleteFilteredAssetsContextSchema.parse(context)).toThrow();
    });
  });

  describe('AssertUploadAssetContextSchema', () => {
    const payload = {
      current: baseAsset,
      batch: {
        key: baseAsset.key,
        reference_id: 123n,
        expires_at: 1700000000000010n,
        encoding_type: 'identity'
      },
      commit_batch: {
        batch_id: 111n,
        headers: [['Content-Type', 'image/png']],
        chunk_ids: [1n, 2n]
      }
    };

    it('should validate a valid AssertUploadAssetContext', () => {
      const context = {
        ...baseContext,
        data: payload
      };
      expect(() => AssertUploadAssetContextSchema.parse(context)).not.toThrow();
    });

    it('should reject if commit_batch is missing', () => {
      const invalidPayload = {
        ...payload,
        commit_batch: undefined
      };
      const context = {
        ...baseContext,
        data: invalidPayload
      };
      expect(() => AssertUploadAssetContextSchema.parse(context)).toThrow();
    });
  });

  describe('AssertDeleteAssetContextSchema', () => {
    it('should validate a valid AssertDeleteAssetContext', () => {
      const context = {
        ...baseContext,
        data: baseAsset
      };
      expect(() => AssertDeleteAssetContextSchema.parse(context)).not.toThrow();
    });

    it('should reject if asset is invalid', () => {
      const invalidAsset = {
        ...baseAsset,
        created_at: 'bad-timestamp'
      };
      const context = {
        ...baseContext,
        data: invalidAsset
      };
      expect(() => AssertDeleteAssetContextSchema.parse(context)).toThrow();
    });
  });
});
