/**
 * @vitest-environment jsdom
 */

import {Ed25519KeyIdentity} from '@dfinity/identity';
import {parseSessionData, stringifySessionData} from '../../utils/session.utils';
import {generateRandomState} from '../../utils/state.utils';

describe('session.utils', () => {
  describe('stringifySessionData', () => {
    it('should stringify and parse session data correctly', () => {
      const caller = Ed25519KeyIdentity.generate();
      const salt = new Uint8Array(32).fill(7);
      const state = generateRandomState();

      const json = stringifySessionData({caller, salt, state});
      const result = parseSessionData(json);

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

  describe('parseSessionData', () => {
    it('should throw for invalid json', () => {
      expect(() => parseSessionData('not-json')).toThrow();
    });

    it('should throw when required fields are missing', () => {
      expect(() => parseSessionData('{}')).toThrow();
      expect(() => parseSessionData(JSON.stringify({__caller__: {}, __salt__: 'X'}))).toThrow();
    });

    it('should throw when caller is invalid', () => {
      const bad = JSON.stringify({
        __caller__: {foo: 'bar'}, // invalid identity JSON
        __salt__: 'AA==',
        __state__: 'test'
      });
      expect(() => parseSessionData(bad)).toThrow();
    });

    it('should throw when salt is not valid base64', () => {
      const bad = JSON.stringify({
        __caller__: Ed25519KeyIdentity.generate().toJSON(),
        __salt__: '*not-base64*',
        __state__: 'test'
      });
      expect(() => parseSessionData(bad)).toThrow();
    });
  });
});
