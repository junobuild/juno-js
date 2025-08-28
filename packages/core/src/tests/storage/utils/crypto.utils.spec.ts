import {sha256ToBase64String} from '../../../storage/utils/crypto.utils';

describe('crypto.utils', () => {
  it('encodes Uint8Array to base64 string', () => {
    const input = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const result = sha256ToBase64String(input);

    expect(result).toBe(btoa('Hello'));
  });
});
