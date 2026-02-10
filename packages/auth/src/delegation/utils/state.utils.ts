import {toBase64URL} from '../../utils/url.utils';

export const generateRandomState = (): string =>
  toBase64URL(crypto.getRandomValues(new Uint8Array(12)));
