import {Identity} from '@dfinity/agent';
import {arrayBufferToUint8Array} from '@dfinity/utils';
import {WebAuthnIdentity, WebAuthnNewCredential} from '@junobuild/ic-client/webauthn';
import {Environment} from '../../core/types/env';
import {setManyDocs} from '../../datastore/services/doc.services';
import type {User} from '../types/user';

export const createWebAuthnUser = async ({
  delegationIdentity,
  passkeyIdentity,
  satelliteId
}: {
  delegationIdentity: Identity;
  passkeyIdentity: WebAuthnIdentity<WebAuthnNewCredential>;
} & Pick<Environment, 'satelliteId'>): Promise<User> => {
  const [user, _] = await setManyDocs({
    docs: [
      {
        collection: '#user',
        doc: {
          key: delegationIdentity.getPrincipal().toText(),
          data: {
            provider: 'webauthn'
          }
        }
      },
      {
        collection: '#user-webauthn',
        doc: {
          key: passkeyIdentity.getCredential().getCredentialIdText(),
          data: {
            publicKey: arrayBufferToUint8Array(passkeyIdentity.getPublicKey().toDer()),
            aaguid: passkeyIdentity.getCredential().getAAGUID()
          }
        }
      }
    ],
    satellite: {
      identity: delegationIdentity,
      satelliteId
    }
  });

  return user;
};
