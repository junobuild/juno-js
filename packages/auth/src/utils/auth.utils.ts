import type {Ed25519KeyIdentity} from '@dfinity/identity';
import {arrayBufferToUint8Array} from '@dfinity/utils';
import {toBase64URL} from './url.utils';

const generateSalt = (): Uint8Array => window.crypto.getRandomValues(new Uint8Array(32));

const buildNonce = async ({salt, caller}: {salt: Uint8Array; caller: Ed25519KeyIdentity}) => {
  const principal = caller.getPrincipal().toUint8Array();

  const bytes = new Uint8Array(salt.length + principal.byteLength);
  bytes.set(salt);
  bytes.set(principal, salt.length);

  const hash = await window.crypto.subtle.digest('SHA-256', bytes);

  return toBase64URL(arrayBufferToUint8Array(hash));
};

export const generateNonce = async ({
  caller
}: {
  caller: Ed25519KeyIdentity;
}): Promise<{nonce: string; salt: Uint8Array}> => {
  const salt = generateSalt();
  const nonce = await buildNonce({salt, caller});

  return {nonce, salt};
};
