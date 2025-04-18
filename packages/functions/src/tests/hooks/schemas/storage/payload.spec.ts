import {AssetAssertUploadSchema} from '../../../../hooks/schemas/storage/payload';

describe('payload', () => {
  describe('AssetAssertUploadSchema', () => {
    const baseAsset = {
      key: {
        name: 'logo.png',
        full_path: '/images/logo.png',
        collection: 'assets',
        owner: new Uint8Array([1, 2, 3]),
        token: 'token123',
        description: 'Asset description'
      },
      headers: [['Content-Type', 'image/png']],
      encodings: [
        [
          'identity',
          {
            modified: 1700000000000000n,
            content_chunks: [new Uint8Array([1, 2, 3])],
            total_length: 3n,
            sha256: new Uint8Array(32)
          }
        ]
      ],
      created_at: 1700000000000000n,
      updated_at: 1700000000000001n
    };

    const baseBatch = {
      key: baseAsset.key,
      expires_at: 1700000000000002n
    };

    const baseCommitBatch = {
      batch_id: 123n,
      headers: [['Content-Type', 'image/png']],
      chunk_ids: [1n, 2n]
    };

    const valid = {
      current: baseAsset,
      batch: baseBatch,
      commit_batch: baseCommitBatch
    };

    it('should validate a valid AssetAssertUpload object', () => {
      expect(() => AssetAssertUploadSchema.parse(valid)).not.toThrow();
    });

    it('should validate with current omitted', () => {
      const {current, ...partial} = valid;
      expect(() => AssetAssertUploadSchema.parse(partial)).not.toThrow();
    });

    it('should reject with an invalid batch', () => {
      const invalid = {
        ...valid,
        batch: {...baseBatch, expires_at: 'not-a-bigint'}
      };
      expect(() => AssetAssertUploadSchema.parse(invalid)).toThrow();
    });

    it('should reject with an invalid commit_batch', () => {
      const invalid = {
        ...valid,
        commit_batch: {...baseCommitBatch, batch_id: 'not-a-bigint'}
      };
      expect(() => AssetAssertUploadSchema.parse(invalid)).toThrow();
    });

    it('should reject with unknown fields', () => {
      const invalid = {
        ...valid,
        extra: 'should not be here'
      };
      expect(() => AssetAssertUploadSchema.parse(invalid)).toThrow();
    });
  });
});
