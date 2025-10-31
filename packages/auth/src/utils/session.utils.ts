import {Ed25519KeyIdentity, JsonnableEd25519KeyIdentity} from '@dfinity/identity';
import {base64ToUint8Array, uint8ArrayToBase64} from '@dfinity/utils';
import {SessionData} from '../types/session';

const JSON_KEY_CALLER = '__caller__';
const JSON_KEY_SALT = '__salt__';
const JSON_KEY_STATE = '__state__';

interface StoredSessionData {
  [JSON_KEY_CALLER]: JsonnableEd25519KeyIdentity;
  [JSON_KEY_SALT]: string;
  [JSON_KEY_STATE]: string;
}

export const stringifySessionData = ({caller, state, salt}: SessionData): string => {
  const data: StoredSessionData = {
    [JSON_KEY_CALLER]: caller.toJSON(),
    [JSON_KEY_SALT]: uint8ArrayToBase64(salt),
    [JSON_KEY_STATE]: state
  };

  return JSON.stringify(data);
};

export const parseSessionData = (jsonData: string): SessionData => {
  const {
    [JSON_KEY_CALLER]: jsonCaller,
    [JSON_KEY_SALT]: jsonSalt,
    [JSON_KEY_STATE]: state
  }: StoredSessionData = JSON.parse(jsonData);

  return {
    caller: Ed25519KeyIdentity.fromParsedJson(jsonCaller),
    salt: base64ToUint8Array(jsonSalt),
    state
  };
};
