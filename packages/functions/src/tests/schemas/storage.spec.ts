import {Principal} from '@dfinity/principal';
import {ZodError} from 'zod';
import {
  AssetEncodingSchema,
  AssetKeySchema,
  AssetNoContentSchema,
  AssetSchema,
  BatchSchema,
  BlobSchema,
  CommitBatchSchema,
  FullPathSchema,
  HeaderFieldsSchema,
  OptionAssetSchema
} from '../../schemas/storage';
import {ListAssetsStoreParamsSchema} from '../../sdk/schemas/storage';

describe('storage', () => {
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

  describe('AssetSchema', () => {
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

  describe('BatchSchema', () => {
    const validBatch = {
      key: {
        name: 'image.png',
        full_path: '/images/image.png',
        token: 'abcd1234',
        collection: 'assets',
        owner: new Uint8Array([1, 2, 3]),
        description: 'Sample image'
      },
      reference_id: 123n,
      expires_at: 1700000000000000n,
      encoding_type: 'gzip'
    };

    it('should validate a valid Batch', () => {
      expect(() => BatchSchema.parse(validBatch)).not.toThrow();
    });

    it('should validate without optional fields', () => {
      const {reference_id, encoding_type, ...minimalBatch} = validBatch;
      expect(() => BatchSchema.parse(minimalBatch)).not.toThrow();
    });

    it('should reject unknown fields', () => {
      const invalid = {...validBatch, extra: 'nope'};
      expect(() => BatchSchema.parse(invalid)).toThrow();
    });

    it('should reject if expires_at is not bigint', () => {
      const invalid = {...validBatch, expires_at: 'not-a-bigint'};
      expect(() => BatchSchema.parse(invalid)).toThrow();
    });
  });

  describe('CommitBatchSchema', () => {
    const validCommit = {
      batch_id: 123n,
      headers: [['Content-Type', 'image/png']],
      chunk_ids: [1n, 2n, 3n]
    };

    it('should validate a valid CommitBatch', () => {
      expect(() => CommitBatchSchema.parse(validCommit)).not.toThrow();
    });

    it('should reject missing batch_id', () => {
      const {batch_id, ...invalid} = validCommit;
      expect(() => CommitBatchSchema.parse(invalid)).toThrow();
    });

    it('should reject headers if not tuple of strings', () => {
      const invalid = {...validCommit, headers: [['Content-Type']]};
      expect(() => CommitBatchSchema.parse(invalid)).toThrow();
    });

    it('should reject if unknown fields are present', () => {
      const invalid = {...validCommit, extra: 'nope'};
      expect(() => CommitBatchSchema.parse(invalid)).toThrow();
    });
  });

  describe('HeaderFieldsSchema', () => {
    it('should validate a list of header tuples', () => {
      const headers = [
        ['Content-Type', 'image/png'],
        ['Cache-Control', 'no-cache']
      ];
      expect(() => HeaderFieldsSchema.parse(headers)).not.toThrow();
    });

    it('should reject if a header is not a tuple', () => {
      const invalidHeaders = [['Content-Type']];
      expect(() => HeaderFieldsSchema.parse(invalidHeaders)).toThrow();
    });

    it('should reject if header values are not strings', () => {
      const invalidHeaders = [['Content-Type', 123]];
      expect(() => HeaderFieldsSchema.parse(invalidHeaders)).toThrow();
    });
  });

  describe('BlobSchema', () => {
    it('should validate a Uint8Array', () => {
      const blob = new Uint8Array([1, 2, 3]);
      expect(() => BlobSchema.parse(blob)).not.toThrow();
    });

    it('should reject a non-Uint8Array value', () => {
      const notABlob = [1, 2, 3];
      expect(() => BlobSchema.parse(notABlob)).toThrow();
    });
  });

  describe('AssetKeySchema', () => {
    const baseKey = {
      name: 'logo.png',
      full_path: '/images/logo.png',
      collection: 'media',
      owner: new Uint8Array([1, 2, 3]),
      description: 'Logo file'
    };

    it('should validate a complete AssetKey', () => {
      expect(() => AssetKeySchema.parse(baseKey)).not.toThrow();
    });

    it('should validate without optional fields', () => {
      const {description, ...minimal} = baseKey;
      expect(() => AssetKeySchema.parse(minimal)).not.toThrow();
    });

    it('should reject if required fields are missing', () => {
      const {name, ...rest} = baseKey;
      expect(() => AssetKeySchema.parse(rest)).toThrow();
    });

    it('should reject unknown fields', () => {
      const invalid = {...baseKey, extra: 'nope'};
      expect(() => AssetKeySchema.parse(invalid)).toThrow();
    });

    it('should reject if owner is not a Uint8Array', () => {
      const invalid = {...baseKey, owner: 'not-bytes'};
      expect(() => AssetKeySchema.parse(invalid)).toThrow();
    });
  });

  describe('FullPathSchema', () => {
    it('should validate a correct full path', () => {
      const valid = '/images/sample.png';
      expect(() => FullPathSchema.parse(valid)).not.toThrow();
    });

    it('should reject a non-string value', () => {
      const invalid = 123;
      expect(() => FullPathSchema.parse(invalid)).toThrow();
    });

    it('should accept nested paths', () => {
      const nested = '/static/assets/icons/logo.svg';
      expect(() => FullPathSchema.parse(nested)).not.toThrow();
    });
  });

  describe('sdk > storage > OptionAssetSchema', () => {
    it('should validate a valid Asset object', () => {
      expect(() => OptionAssetSchema.parse(baseAsset)).not.toThrow();
    });

    it('should validate undefined', () => {
      expect(() => OptionAssetSchema.parse(undefined)).not.toThrow();
    });

    it('should reject invalid asset data', () => {
      const invalid = {
        ...baseAsset,
        headers: ['not-a-tuple']
      } as unknown;

      expect(() => OptionAssetSchema.parse(invalid)).toThrow();
    });

    it('should reject null (not treated as optional by Zod)', () => {
      expect(() => OptionAssetSchema.parse(null)).toThrow();
    });
  });

  describe('AssetNoContentSchema', () => {
    const validAsset = {
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
          total_length: 123n,
          sha256: new Uint8Array(32)
        }
      },
      created_at: 1700000000000000n,
      updated_at: 1700000000000001n
    };

    it('should validate a valid AssetNoContent object', () => {
      expect(() => AssetNoContentSchema.parse(validAsset)).not.toThrow();
    });

    it('should reject if encodings contain content_chunks', () => {
      const invalid = {
        ...validAsset,
        encodings: {
          identity: {
            ...validAsset.encodings.identity,
            content_chunks: [new Uint8Array([1, 2, 3])]
          }
        }
      };
      expect(() => AssetNoContentSchema.parse(invalid)).toThrow();
    });

    it('should reject if encodings field is missing', () => {
      const {encodings, ...rest} = validAsset;
      expect(() => AssetNoContentSchema.parse(rest)).toThrow();
    });

    it('should reject if key is invalid', () => {
      const invalid = {
        ...validAsset,
        key: {
          name: 'logo.png',
          full_path: '/images/logo.png',
          collection: 'media',
          owner: 'not-a-uint8array'
        }
      };
      expect(() => AssetNoContentSchema.parse(invalid)).toThrow();
    });

    it('should reject unknown fields at the root', () => {
      const invalid = {...validAsset, extra: 'nope'};
      expect(() => AssetNoContentSchema.parse(invalid)).toThrow();
    });
  });

  describe('ListAssetsStoreParamsSchema', () => {
    const collection = 'media';

    const baseParamsWithUint8Array = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      params: {
        paginate: {
          limit: 10n
        }
      }
    };

    const baseParamsWithPrincipal = {
      caller: Principal.anonymous(),
      collection,
      params: {
        order: {
          desc: true,
          field: 'updated_at'
        }
      }
    };

    it('should validate with caller as Uint8Array', () => {
      expect(() => ListAssetsStoreParamsSchema.parse(baseParamsWithUint8Array)).not.toThrow();
    });

    it('should validate with caller as Principal', () => {
      expect(() => ListAssetsStoreParamsSchema.parse(baseParamsWithPrincipal)).not.toThrow();
    });

    it('should reject if collection is missing', () => {
      expect(() =>
        ListAssetsStoreParamsSchema.parse({
          caller: Principal.anonymous(),
          params: {}
        })
      ).toThrow(ZodError);
    });

    it('should reject unknown fields', () => {
      const invalid = {
        ...baseParamsWithPrincipal,
        unexpected: 'nope'
      };
      expect(() => ListAssetsStoreParamsSchema.parse(invalid)).toThrow(ZodError);
    });
  });

  describe('AssetEncodingSchema', () => {
    const validEncoding = {
      modified: 1700000000000000n,
      content_chunks: [new Uint8Array([1, 2, 3])],
      total_length: 1024n,
      sha256: new Uint8Array(32) // 32 zero bytes
    };

    it('should validate a correct asset encoding', () => {
      expect(() => AssetEncodingSchema.parse(validEncoding)).not.toThrow();
    });

    it('should reject if sha256 is not 32 bytes', () => {
      const invalidSha256 = {
        ...validEncoding,
        sha256: new Uint8Array(31)
      };

      expect(() => AssetEncodingSchema.parse(invalidSha256)).toThrow(
        /Hash must be a Uint8Array of length 32/
      );
    });

    it('should reject if content_chunks is not an array of Uint8Array', () => {
      const invalidChunks = {
        ...validEncoding,
        content_chunks: ['not-a-uint8array']
      };

      expect(() => AssetEncodingSchema.parse(invalidChunks)).toThrow();
    });

    it('should reject if modified is not a bigint', () => {
      const invalidModified = {
        ...validEncoding,
        modified: 'not-a-bigint'
      };

      expect(() => AssetEncodingSchema.parse(invalidModified)).toThrow();
    });

    it('should reject if total_length is not a bigint', () => {
      const invalidTotalLength = {
        ...validEncoding,
        total_length: 1024
      };

      expect(() => AssetEncodingSchema.parse(invalidTotalLength)).toThrow();
    });
  });
});
