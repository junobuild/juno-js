import {Principal} from '@dfinity/principal';
import {
  Controller,
  ControllerRecordSchema,
  ControllerSchema,
  ControllersSchema
} from '../../../sdk/schemas/controllers';
import {mockRawUserId, mockUserIdText} from '../../mocks/controllers.mocks';

describe('controllers', () => {
  describe('ControllerSchema', () => {
    const validController = {
      metadata: [
        ['role', 'admin'],
        ['env', 'prod']
      ],
      created_at: BigInt(1711900000000),
      updated_at: BigInt(1711905000000),
      expires_at: BigInt(1719999999999),
      scope: 'admin'
    };

    it('parses a valid controller', () => {
      const result = ControllerSchema.parse(validController);
      expect(result.scope).toBe('admin');
      expect(result.metadata.length).toBe(2);
    });

    it('fails if metadata is not an array of tuples', () => {
      expect(() =>
        ControllerSchema.parse({
          ...validController,
          metadata: {role: 'admin'}
        })
      ).toThrow();
    });

    it('fails if created_at is not a bigint', () => {
      expect(() =>
        ControllerSchema.parse({
          ...validController,
          created_at: 1234567890
        })
      ).toThrow();
    });

    it('accepts missing expires_at (optional)', () => {
      const {expires_at: _, ...withoutExpires} = validController;
      const result = ControllerSchema.parse(withoutExpires);
      expect(result.expires_at).toBeUndefined();
    });

    it('fails if scope is not in enum', () => {
      expect(() =>
        ControllerSchema.parse({
          ...validController,
          scope: 'superadmin'
        })
      ).toThrow();
    });
  });

  describe('ControllerRecordSchema', () => {
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
      const result = ControllerRecordSchema.parse(validRecord);
      expect(result[0]).toBe(mockRawUserId);
      expect(result[1].scope).toBe('write');
    });

    it('fails if not a tuple', () => {
      expect(() =>
        ControllerRecordSchema.parse({
          principal: mockUserIdText,
          controller: validRecord[1]
        })
      ).toThrow();
    });
  });

  describe('ControllersSchema', () => {
    const principal = Principal.fromText('aaaaa-aa');
    const rawUserId = principal.toUint8Array();
    const rawAnonymousId = Principal.anonymous().toUint8Array();

    const validControllers = [
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

    it('parses a valid array of controller records', () => {
      const result = ControllersSchema.parse(validControllers);
      expect(result.length).toBe(3);
      expect(result[0][0]).toBe(mockRawUserId);
      expect(result[1][0]).toBe(rawUserId);
      expect(result[2][0]).toBe(rawAnonymousId);
    });

    it('fails if any record is invalid', () => {
      const invalidControllers = [...validControllers];
      const controller = invalidControllers[1][1] as Controller;

      invalidControllers[1] = [rawUserId, {...controller, scope: 'godmode'}];

      expect(() => ControllersSchema.parse(invalidControllers)).toThrow();
    });
  });
});
