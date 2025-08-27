import {extractAAGUID} from '../../webauthn/_aaguid';
import {hexToBytes, makeAuthData} from './_aaguid.mock';

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

  it('should extract and formats a non-zero AAGUID (53 bytes)', () => {
    const aaguid = '00112233-4455-6677-8899-aabbccddeeff';
    const authData = makeAuthData({len: 53, aaguidBytes: hexToBytes({aaguid})});
    const r = extractAAGUID({authData});
    expect(r).toEqual({aaguid});
  });

  it('should extract correctly even when authData is longer than 53 bytes', () => {
    const aaguid = 'deadbeef-0001-0203-0405-060708090a0b';
    const authData = makeAuthData({len: 120, aaguidBytes: hexToBytes({aaguid})});
    const r = extractAAGUID({authData});
    expect(r).toEqual({aaguid});
  });

  it('should produce lowercase hex with hyphens', () => {
    const aaguid = 'ABCDEF12-3456-7890-ABCD-EF1234567890'.toLowerCase();
    const authData = makeAuthData({
      len: 53,
      aaguidBytes: hexToBytes({aaguid: 'abcdef12-3456-7890-abcd-ef1234567890'})
    });
    const r = extractAAGUID({authData});
    expect('aaguid' in r && r.aaguid === aaguid).toBe(true);
  });
});
