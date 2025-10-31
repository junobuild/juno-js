/**
 * @vitest-environment jsdom
 */

import {Ed25519KeyIdentity, JsonnableEd25519KeyIdentity} from '@dfinity/identity';
import {Principal} from '@dfinity/principal';
import {assertNonNullish, base64ToUint8Array} from '@dfinity/utils';
import {SESSION_KEY} from '../_constants';
import {initContext} from '../_context';
import {parseContext} from '../utils/session-storage.utils';

describe('_context', () => {
  describe('initContext', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('should return nonce and state', async () => {
      const {nonce, state} = await initContext();

      expect(typeof nonce).toBe('string');
      expect(typeof state).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
      expect(state.length).toBeGreaterThan(0);
    });

    it('should store a single SESSION_KEY entry', async () => {
      await initContext();

      expect(sessionStorage.length).toBe(1);
      expect(sessionStorage.getItem(SESSION_KEY)).not.toBeNull();
    });

    it('should store caller, salt and state in SESSION_KEY payload', async () => {
      await initContext();

      const raw = sessionStorage.getItem(SESSION_KEY);
      assertNonNullish(raw);

      const parsed = JSON.parse(raw) as Record<string, unknown>;

      expect(parsed.__caller__).not.toBeUndefined();
      expect(parsed.__salt__).not.toBeUndefined();
      expect(parsed.__state__).not.toBeUndefined();
    });

    it('should return same state as stored', async () => {
      const {state} = await initContext();

      const raw = sessionStorage.getItem(SESSION_KEY);
      assertNonNullish(raw);

      const stored = parseContext(raw);

      expect(state).toBe(stored.state);
    });

    it('should store salt as base64 that decodes to 32 bytes', async () => {
      await initContext();

      const raw = sessionStorage.getItem(SESSION_KEY);
      assertNonNullish(raw);

      const {__salt__} = JSON.parse(raw) as {__salt__: string};

      const bytes = base64ToUint8Array(__salt__);

      expect(bytes).toBeInstanceOf(Uint8Array);
      expect(bytes.length).toBe(32);
    });

    it('should store a valid caller JSON', async () => {
      await initContext();

      const raw = sessionStorage.getItem(SESSION_KEY);
      assertNonNullish(raw);

      const {__caller__} = JSON.parse(raw) as {__caller__: JsonnableEd25519KeyIdentity};

      const identity = Ed25519KeyIdentity.fromParsedJson(__caller__);
      expect(Principal.isPrincipal(identity.getPrincipal())).toBeTruthy();
    });

    it('should generate new values on each call', async () => {
      const first = await initContext();
      const second = await initContext();

      expect(first.nonce).not.toBe(second.nonce);
      expect(first.state).not.toBe(second.state);
    });
  });
});
