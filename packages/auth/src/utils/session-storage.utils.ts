import {base64ToUint8Array, uint8ArrayToBase64} from '@dfinity/utils';
import {Ed25519KeyIdentity, type JsonnableEd25519KeyIdentity} from '@icp-sdk/core/identity';
import type {OpenIdAuthContext} from '../types/context';

const JSON_KEY_CALLER = '__caller__';
const JSON_KEY_SALT = '__salt__';
const JSON_KEY_STATE = '__state__';

interface StoredContext {
  [JSON_KEY_CALLER]: JsonnableEd25519KeyIdentity;
  [JSON_KEY_SALT]: string;
  [JSON_KEY_STATE]: string;
}

export const stringifyContext = ({caller, state, salt}: OpenIdAuthContext): string => {
  const data: StoredContext = {
    [JSON_KEY_CALLER]: caller.toJSON(),
    [JSON_KEY_SALT]: uint8ArrayToBase64(salt),
    [JSON_KEY_STATE]: state
  };

  return JSON.stringify(data);
};

export const parseContext = (jsonData: string): OpenIdAuthContext => {
  const {
    [JSON_KEY_CALLER]: jsonCaller,
    [JSON_KEY_SALT]: jsonSalt,
    [JSON_KEY_STATE]: state
  }: StoredContext = JSON.parse(jsonData);

  return {
    caller: Ed25519KeyIdentity.fromParsedJson(jsonCaller),
    salt: base64ToUint8Array(jsonSalt),
    state
  };
};
