/**
 * @vitest-environment jsdom
 */

import {generateRandomState} from '../../../delegation/utils/state.utils';

describe('state.utils', () => {
  describe('generateRandomState', () => {
    it('should return a string', () => {
      const state = generateRandomState();
      expect(typeof state).toBe('string');
    });

    it('should produce 16 chars (base64url of 12 bytes)', () => {
      const state = generateRandomState();
      // 12 bytes → base64url = ceil(12 / 3) * 4 = 16 chars
      expect(state.length).toBe(16);
    });

    it('should not contain +, /, or =', () => {
      const state = generateRandomState();
      expect(state.includes('+')).toBeFalsy();
      expect(state.includes('/')).toBeFalsy();
      expect(state.includes('=')).toBeFalsy();
    });

    it('should generate different values on subsequent calls', () => {
      const a = generateRandomState();
      const b = generateRandomState();
      expect(a).not.toBe(b);
    });

    it('should match base64url charset', () => {
      const state = generateRandomState();
      expect(/^[A-Za-z0-9_-]+$/.test(state)).toBeTruthy();
    });
  });
});
