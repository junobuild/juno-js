import {
  getAccessKeys,
  getAdminAccessKeys,
  isAdminController,
  isValidAccessKey,
  isWriteAccessKey
} from '../../sdk/access-keys.sdk';
import {AccessKeyCheckParams, AccessKeys} from '../../sdk/schemas/access-keys';
import {mockRawUserId, mockUserIdPrincipal} from '../mocks/user.mock';

describe('accessKeys.sdk', () => {
  const validAccessKeys: AccessKeys = [
    [
      mockRawUserId,
      {
        metadata: [['name', 'test']],
        created_at: BigInt(1),
        updated_at: BigInt(2),
        scope: 'admin'
      }
    ]
  ];

  beforeEach(() => {
    globalThis.__juno_satellite_get_admin_access_keys = vi.fn(() => validAccessKeys);
    globalThis.__juno_satellite_get_access_keys = vi.fn(() => validAccessKeys);
    globalThis.__juno_satellite_is_write_access_key = vi.fn(() => false);
    globalThis.__juno_satellite_is_valid_access_key = vi.fn(() => false);
    globalThis.__juno_satellite_is_admin_controller = vi.fn(() => true);
  });

  describe('getAdminAccessKeys', () => {
    it('returns the result from the Satellite', () => {
      const result = getAdminAccessKeys();
      expect(result).toEqual(validAccessKeys);
    });
  });

  describe('getAccessKeys', () => {
    it('returns the result from the Satellite', () => {
      const result = getAccessKeys();
      expect(result).toEqual(validAccessKeys);
    });
  });

  describe('isWriteAccessKey', () => {
    it('returns false when id is not an access key with write permission', () => {
      const params: AccessKeyCheckParams = {
        id: mockUserIdPrincipal,
        accessKeys: validAccessKeys
      };

      const result = isWriteAccessKey(params);
      expect(result).toBe(false);
    });
  });

  describe('isValidAccessKey', () => {
    it('returns false when id is not an access key', () => {
      const params: AccessKeyCheckParams = {
        id: mockUserIdPrincipal,
        accessKeys: validAccessKeys
      };

      const result = isValidAccessKey(params);
      expect(result).toBe(false);
    });
  });

  describe('isAdminController', () => {
    it('returns true when principal is an admin access key and controller', () => {
      const params: AccessKeyCheckParams = {
        id: mockUserIdPrincipal,
        accessKeys: validAccessKeys
      };

      const result = isAdminController(params);
      expect(result).toBe(true);
    });

    it('returns true when raw principal is an admin access key and controller', () => {
      const params: AccessKeyCheckParams = {
        id: mockRawUserId,
        accessKeys: validAccessKeys
      };

      const result = isAdminController(params);
      expect(result).toBe(true);
    });
  });
});
