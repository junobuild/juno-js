import {uint8ArrayToBase64} from '@dfinity/utils';

// In the future: uint8Array.toBase64({ alphabet: "base64url" })
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64
export const toBase64URL = (uint8Array: Uint8Array): string =>
  uint8ArrayToBase64(uint8Array).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
