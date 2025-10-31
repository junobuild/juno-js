/**
 * @vitest-environment jsdom
 */

import {assertNonNullish, base64ToUint8Array} from '@dfinity/utils';
import {SESSION_KEY_CALLER, SESSION_KEY_SALT, SESSION_KEY_STATE} from '../_constants';
import {initSession} from '../_session';

describe('_session', () => {
  describe('initSession', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('should return nonce and state', async () => {
      const {nonce, state} = await initSession();

      expect(typeof nonce).toBe('string');
      expect(typeof state).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
      expect(state.length).toBeGreaterThan(0);
    });

    it('should store caller, salt and state in sessionStorage', async () => {
      await initSession();

      const caller = sessionStorage.getItem(SESSION_KEY_CALLER);
      const salt = sessionStorage.getItem(SESSION_KEY_SALT);
      const state = sessionStorage.getItem(SESSION_KEY_STATE);

      expect(caller).not.toBeNull();
      expect(salt).not.toBeNull();
      expect(state).not.toBeNull();
    });

    it('should returns same state as the one stored', async () => {
      const {state} = await initSession();

      const storedState = sessionStorage.getItem(SESSION_KEY_STATE);

      expect(state).toEqual(storedState);
    });

    it('should store not other keys', async () => {
      await initSession();

      expect(sessionStorage.length).toEqual(
        [SESSION_KEY_CALLER, SESSION_KEY_SALT, SESSION_KEY_STATE].length
      );
    });

    it('should store caller as JSON string', async () => {
      await initSession();

      const callerJson = sessionStorage.getItem(SESSION_KEY_CALLER);
      expect(() => JSON.parse(callerJson as string)).not.toThrow();
    });

    it('should store salt as base64', async () => {
      await initSession();

      const salt = sessionStorage.getItem(SESSION_KEY_SALT);

      assertNonNullish(salt);

      expect(typeof salt).toBe('string');
      expect(() => base64ToUint8Array(salt)).not.toThrow();
    });

    it('should store state as string', async () => {
      await initSession();

      const state = sessionStorage.getItem(SESSION_KEY_STATE);
      expect(typeof state).toBe('string');
    });

    it('should generate new values on each call', async () => {
      const first = await initSession();
      const second = await initSession();

      expect(first.nonce).not.toBe(second.nonce);
      expect(first.state).not.toBe(second.state);
    });
  });
});
