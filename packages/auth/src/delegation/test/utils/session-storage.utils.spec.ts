/**
 * @vitest-environment jsdom
 */

import {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import {parseContext, stringifyContext} from '../../utils/session-storage.utils';
import {generateRandomState} from '../../utils/state.utils';

describe('session-storage.utils', () => {
  describe('stringifyContext', () => {
    it('should stringify and parse session data correctly', () => {
      const caller = Ed25519KeyIdentity.generate();
      const salt = new Uint8Array(32).fill(7);
      const state = generateRandomState();

      const json = stringifyContext({caller, salt, state});
      const result = parseContext(json);

      expect(result.state).toBe(state);
      expect(result.salt).toEqual(salt);

      expect(result.caller.getPrincipal().toText()).toBe(caller.getPrincipal().toText());
      expect('sign' in result.caller).toBeTruthy();

      const resultCallerJson = result.caller.toJSON();
      const callerJson = caller.toJSON();

      expect(resultCallerJson.length).toEqual(callerJson.length);
      expect(resultCallerJson[0]).toEqual(callerJson[0]);
      expect(resultCallerJson[1]).toEqual(callerJson[1]);
    });
  });

  describe('parseContext', () => {
    it('should throw for invalid json', () => {
      expect(() => parseContext('not-json')).toThrow();
    });

    it('should throw when required fields are missing', () => {
      expect(() => parseContext('{}')).toThrow();
      expect(() => parseContext(JSON.stringify({__caller__: {}, __salt__: 'X'}))).toThrow();
    });

    it('should throw when caller is invalid', () => {
      const bad = JSON.stringify({
        __caller__: {foo: 'bar'}, // invalid identity JSON
        __salt__: 'AA==',
        __state__: 'test'
      });
      expect(() => parseContext(bad)).toThrow();
    });

    it('should throw when salt is not valid base64', () => {
      const bad = JSON.stringify({
        __caller__: Ed25519KeyIdentity.generate().toJSON(),
        __salt__: '*not-base64*',
        __state__: 'test'
      });
      expect(() => parseContext(bad)).toThrow();
    });
  });
});
