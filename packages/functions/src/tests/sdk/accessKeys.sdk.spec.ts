import {getAccessKeys, getAdminAccessKeys} from '../../sdk/accessKeys.sdk';
import {AccessKeys} from '../../sdk/schemas/accessKeys';
import {mockRawUserId} from '../mocks/user.mock';

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
    globalThis.__juno_satellite_is_admin_controller = vi.fn(() => true);
    globalThis.__juno_satellite_is_controller = vi.fn(() => false);
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
});
