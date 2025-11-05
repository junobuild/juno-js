import {toBase64URL} from './url.utils';

export const generateRandomState = (): string =>
  toBase64URL(window.crypto.getRandomValues(new Uint8Array(12)));
