import {uint8ArrayToBase64} from '@dfinity/utils';
import {InvalidUrlError} from '../errors';

// In the future: uint8Array.toBase64({ alphabet: "base64url" })
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/toBase64
export const toBase64URL = (uint8Array: Uint8Array): string =>
  uint8ArrayToBase64(uint8Array).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const parseUrl = ({url}: {url: string}): URL => {
  try {
    // Use the URL constructor, for backwards compatibility with older Android/WebView.
    return new URL(url);
  } catch (_error: unknown) {
    throw new InvalidUrlError('Cannot parse authURL', {cause: url});
  }
};
