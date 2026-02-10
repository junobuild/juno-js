/**
 * @vitest-environment jsdom
 */

import {generateNonce} from '../../utils/auth.utils';
import {mockIdentity} from '../mocks/identity.mock';

describe('auth.utils', () => {
  describe('generateNonce', () => {
    it('should generate a salt of length 32', async () => {
      const {salt} = await generateNonce({caller: mockIdentity});
      expect(salt).toBeInstanceOf(Uint8Array);
      expect(salt.length).toBe(32);
    });

    it('should generate a base64url nonce string', async () => {
      const {nonce} = await generateNonce({caller: mockIdentity});
      expect(typeof nonce).toBe('string');
      expect(nonce.includes('+')).toBeFalsy();
      expect(nonce.includes('/')).toBeFalsy();
      expect(nonce.includes('=')).toBeFalsy();
    });

    it('should generate different salts on subsequent calls', async () => {
      const result1 = await generateNonce({caller: mockIdentity});
      const result2 = await generateNonce({caller: mockIdentity});

      expect(result1.salt).not.toEqual(result2.salt);
    });

    it('should generate different nonces on subsequent calls', async () => {
      const result1 = await generateNonce({caller: mockIdentity});
      const result2 = await generateNonce({caller: mockIdentity});

      expect(result1.nonce).not.toBe(result2.nonce);
    });

    it('should produce deterministic nonce for same salt and caller', async () => {
      const fixedSalt = new Uint8Array(32).fill(42);

      const originalGetRandomValues = window.crypto.getRandomValues;
      // @ts-ignore
      window.crypto.getRandomValues = vi.fn(() => fixedSalt);

      const result1 = await generateNonce({caller: mockIdentity});

      // @ts-ignore
      window.crypto.getRandomValues = vi.fn(() => fixedSalt);
      const result2 = await generateNonce({caller: mockIdentity});

      expect(result1.nonce).toBe(result2.nonce);

      window.crypto.getRandomValues = originalGetRandomValues;
    });

    it('should generate a valid base64url string as nonce', async () => {
      const result = await generateNonce({caller: mockIdentity});

      expect(result.nonce).not.toMatch(/[+/=]/);
      expect(result.nonce).toMatch(/^[A-Za-z0-9_-]*$/);
    });

    it('should use SHA-256 for hashing', async () => {
      const digestSpy = vi.spyOn(window.crypto.subtle, 'digest');

      await generateNonce({caller: mockIdentity});

      expect(digestSpy).toHaveBeenCalledWith('SHA-256', expect.any(Uint8Array));
    });

    it('should combine salt and principal bytes before hashing', async () => {
      const digestSpy = vi.spyOn(window.crypto.subtle, 'digest');

      await generateNonce({caller: mockIdentity});

      expect(digestSpy).toHaveBeenCalledWith('SHA-256', expect.any(Uint8Array));

      const digestInput = digestSpy.mock.calls[0][1] as Uint8Array;
      expect(digestInput.length).toBe(32 + mockIdentity.getPrincipal().toUint8Array().length);

      expect(digestInput.slice(32)).toEqual(mockIdentity.getPrincipal().toUint8Array());
    });
  });
});
