import {bytesToAAGUID, extractAAGUID} from '../../webauthn/aaguid';
import {hexToBytes, makeAuthData} from './_aaguid.mock';

describe('AAGUID', () => {
  describe('extractAAGUID', () => {
    it('should return invalidAuthData for buffers shorter than 37 bytes', () => {
      const r = extractAAGUID({authData: makeAuthData({len: 36})});
      expect(r).toEqual({invalidAuthData: null});
    });

    it('should return invalidAuthData for 37 <= length < 53 (no room for AAGUID)', () => {
      expect(extractAAGUID({authData: makeAuthData({len: 37})})).toEqual({invalidAuthData: null});
      expect(extractAAGUID({authData: makeAuthData({len: 52})})).toEqual({invalidAuthData: null});
    });

    it('should return unknownProvider for an all-zero AAGUID', () => {
      const zeros = new Uint8Array(16);
      const authData = makeAuthData({len: 53, aaguidBytes: zeros});
      const r = extractAAGUID({authData});
      expect(r).toEqual({unknownProvider: null});
    });

    it('should extract and format a non-zero AAGUID (53 bytes)', () => {
      const aaguidText = '00112233-4455-6677-8899-aabbccddeeff';
      const aaguidBytes = hexToBytes({aaguid: aaguidText});
      const authData = makeAuthData({len: 53, aaguidBytes});
      const r = extractAAGUID({authData});
      expect(r).toEqual({aaguidText, aaguidBytes: Array.from(aaguidBytes)});
    });

    it('should extract correctly even when authData is longer than 53 bytes', () => {
      const aaguidText = 'deadbeef-0001-0203-0405-060708090a0b';
      const aaguidBytes = hexToBytes({aaguid: aaguidText});
      const authData = makeAuthData({len: 120, aaguidBytes});
      const r = extractAAGUID({authData});
      expect(r).toEqual({aaguidText, aaguidBytes: Array.from(aaguidBytes)});
    });

    it('should produce lowercase hex with hyphens', () => {
      const upper = 'ABCDEF12-3456-7890-ABCD-EF1234567890';
      const aaguidBytes = hexToBytes({aaguid: upper});
      const authData = makeAuthData({len: 53, aaguidBytes});
      const r = extractAAGUID({authData});
      expect('aaguidText' in r && r.aaguidText === upper.toLowerCase()).toBe(true);
      expect('aaguidBytes' in r && r.aaguidBytes).toEqual(Array.from(aaguidBytes));
    });
  });

  describe('bytesToAAGUID', () => {
    it('returns invalidBytes when length != 16', () => {
      expect(bytesToAAGUID({bytes: []})).toEqual({invalidBytes: null});
      expect(bytesToAAGUID({bytes: new Array(15).fill(0)})).toEqual({invalidBytes: null});
      expect(bytesToAAGUID({bytes: new Array(17).fill(0)})).toEqual({invalidBytes: null});
    });

    it('returns unknownProvider for all-zero bytes', () => {
      const bytes = new Array(16).fill(0);
      expect(bytesToAAGUID({bytes})).toEqual({unknownProvider: null});
    });

    it('formats non-zero bytes to canonical string', () => {
      const aaguid = '00112233-4455-6677-8899-aabbccddeeff';
      const bytes = Array.from(hexToBytes({aaguid}));
      expect(bytesToAAGUID({bytes})).toEqual({aaguid});
    });

    it('outputs lowercase hex with hyphens', () => {
      const upper = 'ABCDEF12-3456-7890-ABCD-EF1234567890';
      const bytes = Array.from(hexToBytes({aaguid: upper}));
      const res = bytesToAAGUID({bytes});
      expect('aaguid' in res && res.aaguid === upper.toLowerCase()).toBe(true);
    });

    it('accepts Uint8Array input', () => {
      const aaguid = 'deadbeef-0001-0203-0405-060708090a0b';
      const u8 = hexToBytes({aaguid}); // Uint8Array
      expect(bytesToAAGUID({bytes: u8})).toEqual({aaguid});
    });

    it('returns unknownProvider for all-zero Uint8Array', () => {
      expect(bytesToAAGUID({bytes: new Uint8Array(16)})).toEqual({unknownProvider: null});
    });
  });
});
