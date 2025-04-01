import {Principal} from '@dfinity/principal';
import {
  getAdminControllers,
  getControllers,
  isAdminController,
  isController
} from '../../sdk/controllers.sdk';
import {ControllerCheckParams, Controllers} from '../../sdk/schemas/controllers';

describe('controllers.sdk', () => {
  const mockPrincipalText = 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe';
  const principal = Principal.fromText(mockPrincipalText);
  const rawUserId = principal.toUint8Array();

  const validControllers: Controllers = [
    [
      rawUserId,
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
        caller: principal,
        controllers: validControllers
      };

      const result = isAdminController(params);
      expect(result).toBe(true);
    });

    it('returns true when caller is a RawUserId (Uint8Array)', () => {
      const params: ControllerCheckParams = {
        caller: rawUserId,
        controllers: validControllers
      };

      const result = isAdminController(params);
      expect(result).toBe(true);
    });
  });

  describe('isController', () => {
    it('returns false when caller is not a controller', () => {
      const params: ControllerCheckParams = {
        caller: principal,
        controllers: validControllers
      };

      const result = isController(params);
      expect(result).toBe(false);
    });
  });
});
