import {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import {Principal} from '@icp-sdk/core/principal';
import {initContext} from '../../automation/_context';

describe('_context', () => {
  describe('initContext', () => {
    it('should return nonce, salt, and caller', async () => {
      const {nonce, salt, caller} = await initContext();

      expect(typeof nonce).toBe('string');
      expect(salt).toBeInstanceOf(Uint8Array);
      expect(caller).toBeInstanceOf(Ed25519KeyIdentity);
      expect(nonce.length).toBeGreaterThan(0);
      expect(salt.length).toBeGreaterThan(0);
    });

    it('should generate a valid Ed25519KeyIdentity caller', async () => {
      const {caller} = await initContext();

      expect(Principal.isPrincipal(caller.getPrincipal())).toBeTruthy();
    });

    it('should generate salt as 32 bytes', async () => {
      const {salt} = await initContext();

      expect(salt).toBeInstanceOf(Uint8Array);
      expect(salt.length).toBe(32);
    });

    it('should generate unique values on each call', async () => {
      const first = await initContext();
      const second = await initContext();

      expect(first.nonce).not.toBe(second.nonce);
      expect(Array.from(first.salt)).not.toEqual(Array.from(second.salt));
      expect(first.caller.getPrincipal().toText()).not.toBe(second.caller.getPrincipal().toText());
    });
  });
});
