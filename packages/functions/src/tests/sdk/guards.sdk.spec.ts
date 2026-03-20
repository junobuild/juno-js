import {callerHasWritePermission, callerIsAccessKey, callerIsAdmin} from '../../sdk/guards.sdk';

describe('guards.sdk', () => {
  beforeEach(() => {
    globalThis.__juno_satellite_caller_is_admin = vi.fn(() => undefined);
    globalThis.__juno_satellite_caller_has_write_permission = vi.fn(() => undefined);
    globalThis.__juno_satellite_caller_is_access_key = vi.fn(() => undefined);
  });

  describe('callerIsAdmin', () => {
    it('calls the Satellite guard', () => {
      callerIsAdmin();
      expect(globalThis.__juno_satellite_caller_is_admin).toHaveBeenCalledOnce();
    });

    it('throws if the guard throws', () => {
      globalThis.__juno_satellite_caller_is_admin = vi.fn(() => {
        throw new Error('Not an admin');
      });
      expect(() => callerIsAdmin()).toThrow('Not an admin');
    });
  });

  describe('callerHasWritePermission', () => {
    it('calls the Satellite guard', () => {
      callerHasWritePermission();
      expect(globalThis.__juno_satellite_caller_has_write_permission).toHaveBeenCalledOnce();
    });

    it('throws if the guard throws', () => {
      globalThis.__juno_satellite_caller_has_write_permission = vi.fn(() => {
        throw new Error('No write permission');
      });
      expect(() => callerHasWritePermission()).toThrow('No write permission');
    });
  });

  describe('callerIsAccessKey', () => {
    it('calls the Satellite guard', () => {
      callerIsAccessKey();
      expect(globalThis.__juno_satellite_caller_is_access_key).toHaveBeenCalledOnce();
    });

    it('throws if the guard throws', () => {
      globalThis.__juno_satellite_caller_is_access_key = vi.fn(() => {
        throw new Error('Not an access key');
      });
      expect(() => callerIsAccessKey()).toThrow('Not an access key');
    });
  });
});
