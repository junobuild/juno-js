import {
  getAdminControllers,
  getControllers,
  isAdminController,
  isController
} from '../../sdk/controllers.sdk';
import {ControllerCheckParams, Controllers} from '../../sdk/schemas/controllers';
import {mockRawUserId, mockUserIdPrincipal} from '../mocks/controllers.mocks';

describe('controllers.sdk', () => {
  const validControllers: Controllers = [
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
    globalThis.__juno_satellite_datastore_get_admin_controllers = vi.fn(() => validControllers);
    globalThis.__juno_satellite_datastore_get_controllers = vi.fn(() => validControllers);
    globalThis.__juno_satellite_datastore_is_admin_controller = vi.fn(() => true);
    globalThis.__juno_satellite_datastore_is_controller = vi.fn(() => false);
  });

  describe('getAdminControllers', () => {
    it('returns the result from the Satellite', () => {
      const result = getAdminControllers();
      expect(result).toEqual(validControllers);
    });
  });

  describe('getControllers', () => {
    it('returns the result from the Satellite', () => {
      const result = getControllers();
      expect(result).toEqual(validControllers);
    });
  });

  describe('isAdminController', () => {
    it('returns true when caller is a Principal', () => {
      const params: ControllerCheckParams = {
        caller: mockUserIdPrincipal,
        controllers: validControllers
      };

      const result = isAdminController(params);
      expect(result).toBe(true);
    });

    it('returns true when caller is a RawUserId (Uint8Array)', () => {
      const params: ControllerCheckParams = {
        caller: mockRawUserId,
        controllers: validControllers
      };

      const result = isAdminController(params);
      expect(result).toBe(true);
    });
  });

  describe('isController', () => {
    it('returns false when caller is not a controller', () => {
      const params: ControllerCheckParams = {
        caller: mockUserIdPrincipal,
        controllers: validControllers
      };

      const result = isController(params);
      expect(result).toBe(false);
    });
  });
});
