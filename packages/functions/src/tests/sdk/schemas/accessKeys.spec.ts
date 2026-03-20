import {Principal} from '@icp-sdk/core/principal';
import {
  AccessKey,
  AccessKeyRecordSchema,
  AccessKeySchema,
  AccessKeysSchema
} from '../../../sdk/schemas/accessKeys';
import {mockRawUserId, mockUserIdText} from '../../mocks/user.mock';

describe('accessKeys', () => {
  describe('AccessKeySchema', () => {
    const validFullAccessKey = {
      metadata: [
        ['role', 'admin'],
        ['env', 'prod']
      ],
      created_at: BigInt(1711900000000),
      updated_at: BigInt(1711905000000),
      expires_at: BigInt(1719999999999),
      scope: 'admin',
      kind: 'automation'
    };

    it('parses a valid access key', () => {
      const result = AccessKeySchema.parse(validFullAccessKey);
      expect(result.scope).toBe('admin');
      expect(result.kind).toBe('automation');
      expect(result.metadata.length).toBe(2);
    });

    it('fails if metadata is not an array of tuples', () => {
      expect(() =>
        AccessKeySchema.parse({
          ...validFullAccessKey,
          metadata: {role: 'admin'}
        })
      ).toThrow();
    });

    it('fails if created_at is not a bigint', () => {
      expect(() =>
        AccessKeySchema.parse({
          ...validFullAccessKey,
          created_at: 1234567890
        })
      ).toThrow();
    });

    it('accepts missing expires_at (optional)', () => {
      const {expires_at: _, ...withoutExpires} = validFullAccessKey;
      const result = AccessKeySchema.parse(withoutExpires);
      expect(result.expires_at).toBeUndefined();
    });

    it('accepts missing kind (optional)', () => {
      const {kind: _, ...withoutKind} = validFullAccessKey;
      const result = AccessKeySchema.parse(withoutKind);
      expect(result.kind).toBeUndefined();
    });

    it('fails if scope is not in enum', () => {
      expect(() =>
        AccessKeySchema.parse({
          ...validFullAccessKey,
          scope: 'superadmin'
        })
      ).toThrow();
    });

    it('fails if kind is not in enum', () => {
      expect(() =>
        AccessKeySchema.parse({
          ...validFullAccessKey,
          kind: 'test'
        })
      ).toThrow();
    });
  });

  describe('AccessKeyRecordSchema', () => {
    const validRecord = [
      mockRawUserId,
      {
        metadata: [['team', 'ops']],
        created_at: BigInt(1711900000000),
        updated_at: BigInt(1711905000000),
        scope: 'write'
      }
    ];

    it('parses a valid record tuple', () => {
      const result = AccessKeyRecordSchema.parse(validRecord);
      expect(result[0]).toBe(mockRawUserId);
      expect(result[1].scope).toBe('write');
    });

    it('fails if not a tuple', () => {
      expect(() =>
        AccessKeyRecordSchema.parse({
          principal: mockUserIdText,
          accessKey: validRecord[1]
        })
      ).toThrow();
    });
  });

  describe('AccessKeysSchema', () => {
    const principal = Principal.fromText('aaaaa-aa');
    const rawUserId = principal.toUint8Array();
    const rawAnonymousId = Principal.anonymous().toUint8Array();

    const validAccessKeys = [
      [
        mockRawUserId,
        {
          metadata: [['x', 'y']],
          created_at: BigInt(1),
          updated_at: BigInt(2),
          scope: 'write'
        }
      ],
      [
        rawUserId,
        {
          metadata: [['k', 'v']],
          created_at: BigInt(3),
          updated_at: BigInt(4),
          expires_at: BigInt(5),
          scope: 'admin'
        }
      ],
      [
        rawAnonymousId,
        {
          metadata: [],
          created_at: BigInt(6),
          updated_at: BigInt(7),
          expires_at: BigInt(8),
          scope: 'submit'
        }
      ]
    ];

    it('parses a valid array of access key records', () => {
      const result = AccessKeysSchema.parse(validAccessKeys);
      expect(result.length).toBe(3);
      expect(result[0][0]).toBe(mockRawUserId);
      expect(result[1][0]).toBe(rawUserId);
      expect(result[2][0]).toBe(rawAnonymousId);
    });

    it('fails if any record is invalid', () => {
      const invalidAccessKeys = [...validAccessKeys];
      const accessKey = invalidAccessKeys[1][1] as AccessKey;

      invalidAccessKeys[1] = [rawUserId, {...accessKey, scope: 'godmode'}];

      expect(() => AccessKeysSchema.parse(invalidAccessKeys)).toThrow();
    });
  });
});
