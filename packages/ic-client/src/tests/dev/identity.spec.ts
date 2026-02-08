/**
 * @vitest-environment jsdom
 */

import {DelegationChain, DelegationIdentity, ECDSAKeyIdentity} from '@icp-sdk/core/identity';
import {
  UnsafeDevIdentityInvalidIdentifierError,
  UnsafeDevIdentityNotBrowserError,
  UnsafeDevIdentityNotLocalhostError
} from '../../dev/errors';
import {
  clearDevIdentifiers,
  generateUnsafeDevIdentity,
  loadDevIdentifiers
} from '../../dev/identity';

describe('Dev Identity', () => {
  beforeEach(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      hostname: 'localhost'
    });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();

    await clearDevIdentifiers();
  });

  describe('generateUnsafeDevIdentity', () => {
    describe('Success', () => {
      it('should generate a dev identity with default identifier', async () => {
        const result = await generateUnsafeDevIdentity();

        expect(result.identity).toBeInstanceOf(DelegationIdentity);
        expect(result.sessionKey).toBeInstanceOf(ECDSAKeyIdentity);
        expect(result.delegationChain).toBeInstanceOf(DelegationChain);
      });

      it('should generate a dev identity with custom identifier', async () => {
        const result = await generateUnsafeDevIdentity({identifier: 'alice'});

        expect(result.identity).toBeInstanceOf(DelegationIdentity);
        expect(result.sessionKey).toBeInstanceOf(ECDSAKeyIdentity);
        expect(result.delegationChain).toBeInstanceOf(DelegationChain);
      });

      it('should generate a dev identity with custom maxTimeToLive', async () => {
        const oneDay = 24 * 60 * 60 * 1000;
        const now = Date.now();

        const result = await generateUnsafeDevIdentity({
          maxTimeToLiveInMilliseconds: oneDay
        });

        expect(result.identity).toBeInstanceOf(DelegationIdentity);

        const {delegations} = result.delegationChain;
        const expiration = Number(delegations[0].delegation.expiration / 1_000_000n);

        expect(expiration).toBeGreaterThanOrEqual(now + oneDay - 1000);
        expect(expiration).toBeLessThanOrEqual(now + oneDay + 1000);
      });

      it('should save identifier usage to IndexedDB', async () => {
        await generateUnsafeDevIdentity({identifier: 'bob'});

        const identifiers = await loadDevIdentifiers();

        expect(identifiers).toHaveLength(1);
        expect(identifiers[0][0]).toBe('bob');
        expect(identifiers[0][1]).toHaveProperty('createdAt');
        expect(identifiers[0][1]).toHaveProperty('updatedAt');
      });

      it('should update timestamp for existing identifier', async () => {
        await generateUnsafeDevIdentity({identifier: 'charlie'});
        const first = await loadDevIdentifiers();

        await new Promise((resolve) => setTimeout(resolve, 100));

        await generateUnsafeDevIdentity({identifier: 'charlie'});
        const second = await loadDevIdentifiers();

        expect(second).toHaveLength(1);
        expect(second[0][1].createdAt).toBe(first[0][1].createdAt);
        expect(second[0][1].updatedAt).toBeGreaterThan(first[0][1].updatedAt);
      });

      it('should generate deterministic identity for same identifier', async () => {
        const first = await generateUnsafeDevIdentity({identifier: 'david'});
        const second = await generateUnsafeDevIdentity({identifier: 'david'});

        expect(first.identity.getPrincipal().toText()).toBe(
          second.identity.getPrincipal().toText()
        );
      });
    });

    describe('Errors', () => {
      it('should throw when not in browser environment', async () => {
        vi.stubGlobal('window', undefined);

        await expect(generateUnsafeDevIdentity()).rejects.toBeInstanceOf(
          UnsafeDevIdentityNotBrowserError
        );
      });

      it('should throw when hostname is not localhost', async () => {
        vi.spyOn(window, 'location', 'get').mockReturnValue({
          ...window.location,
          hostname: 'production.example.com'
        });

        await expect(generateUnsafeDevIdentity()).rejects.toBeInstanceOf(
          UnsafeDevIdentityNotLocalhostError
        );
      });

      it('should allow 127.0.0.1 as hostname', async () => {
        vi.spyOn(window, 'location', 'get').mockReturnValue({
          ...window.location,
          hostname: '127.0.0.1'
        });

        const result = await generateUnsafeDevIdentity();
        expect(result.identity).toBeInstanceOf(DelegationIdentity);
      });

      it('should throw when identifier is longer than 32 characters', async () => {
        const longIdentifier = 'this-is-a-very-long-identifier-that-exceeds-32-characters';

        await expect(
          generateUnsafeDevIdentity({identifier: longIdentifier})
        ).rejects.toBeInstanceOf(UnsafeDevIdentityInvalidIdentifierError);
      });

      it('should allow identifier with exactly 32 characters', async () => {
        const exactLength = '12345678901234567890123456789012';

        const result = await generateUnsafeDevIdentity({identifier: exactLength});
        expect(result.identity).toBeInstanceOf(DelegationIdentity);
      });
    });
  });

  describe('loadDevIdentifiers', () => {
    it('should return empty array when no identifiers exist', async () => {
      const identifiers = await loadDevIdentifiers();
      expect(identifiers).toEqual([]);
    });

    it('should return all stored identifiers sorted by most recent first', async () => {
      await generateUnsafeDevIdentity({identifier: 'alice'});
      await new Promise((resolve) => setTimeout(resolve, 10));

      await generateUnsafeDevIdentity({identifier: 'bob'});
      await new Promise((resolve) => setTimeout(resolve, 10));

      await generateUnsafeDevIdentity({identifier: 'charlie'});

      const identifiers = await loadDevIdentifiers();

      expect(identifiers).toHaveLength(3);

      // Most recent first
      expect(identifiers[0][0]).toBe('charlie');
      expect(identifiers[1][0]).toBe('bob');
      expect(identifiers[2][0]).toBe('alice');
    });

    it('should limit returned identifiers when limit param is provided', async () => {
      await generateUnsafeDevIdentity({identifier: 'alice'});
      await new Promise((resolve) => setTimeout(resolve, 10));

      await generateUnsafeDevIdentity({identifier: 'bob'});
      await new Promise((resolve) => setTimeout(resolve, 10));

      await generateUnsafeDevIdentity({identifier: 'charlie'});

      const identifiers = await loadDevIdentifiers({limit: 2});

      expect(identifiers).toHaveLength(2);
      expect(identifiers[0][0]).toBe('charlie');
      expect(identifiers[1][0]).toBe('bob');
    });

    it('should return all identifiers when limit exceeds total count', async () => {
      await generateUnsafeDevIdentity({identifier: 'alice'});
      await generateUnsafeDevIdentity({identifier: 'bob'});

      const identifiers = await loadDevIdentifiers({limit: 10});

      expect(identifiers).toHaveLength(2);
    });

    it('should update sort order when identifier is reused', async () => {
      await generateUnsafeDevIdentity({identifier: 'alice'});
      await new Promise((resolve) => setTimeout(resolve, 10));

      await generateUnsafeDevIdentity({identifier: 'bob'});
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Reuse alice - should move to top
      await generateUnsafeDevIdentity({identifier: 'alice'});

      const identifiers = await loadDevIdentifiers();

      expect(identifiers[0][0]).toBe('alice'); // Most recent
      expect(identifiers[1][0]).toBe('bob');
    });
  });

  describe('clearDevIdentifiers', () => {
    it('should clear all stored identifiers', async () => {
      await generateUnsafeDevIdentity({identifier: 'alice'});
      await generateUnsafeDevIdentity({identifier: 'bob'});

      let identifiers = await loadDevIdentifiers();
      expect(identifiers).toHaveLength(2);

      await clearDevIdentifiers();

      identifiers = await loadDevIdentifiers();
      expect(identifiers).toEqual([]);
    });
  });
});
