import {AssetSchema} from "../../schemas/storage";

describe('storage', () => {
  describe('AssetSchema', () => {
    const baseAsset = {
      key: {
        name: 'logo.png',
        full_path: '/images/logo.png',
        collection: 'media',
        owner: new Uint8Array([1, 2, 3])
      },
      headers: [['Content-Type', 'image/png']],
      encodings: {
        identity: {
          modified: 1700000000000000n,
          content_chunks: [new Uint8Array([4, 5, 6])],
          total_length: 3n,
          sha256: new Uint8Array(32)
        }
      },
      created_at: 1700000000000000n,
      updated_at: 1700000000000001n
    };

    it('should validate a complete Asset', () => {
      expect(() => AssetSchema.parse(baseAsset)).not.toThrow();
    });

    it('should reject an asset with invalid sha256 length', () => {
      const invalidAsset = structuredClone(baseAsset);
      invalidAsset.encodings.identity.sha256 = new Uint8Array(16);
      expect(() => AssetSchema.parse(invalidAsset)).toThrow();
    });

    it('should reject an asset with missing key field', () => {
      const {key, ...rest} = baseAsset;
      expect(() => AssetSchema.parse(rest)).toThrow();
    });

    it('should reject an asset with unknown field', () => {
      const assetWithExtra = {...baseAsset, unexpected: 'field'};
      expect(() => AssetSchema.parse(assetWithExtra)).toThrow();
    });
  });
});
