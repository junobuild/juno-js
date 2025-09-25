import type {Identity} from '@icp-sdk/core/agent';
import {nonNullish, uint8ArrayToArrayOfNumber} from '@dfinity/utils';
import type {WebAuthnIdentity, WebAuthnNewCredential} from '@junobuild/ic-client/webauthn';
import type {Environment} from '../../core/types/env';
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
  // We serialize the AAGUID as number[] instead of Uint8Array because
  // it results in slightly smaller JSON output with the stringifier.
  // When reading the data, we support both formats.
  const aaguid = passkeyIdentity.getCredential().getAAGUID();

  const [user, _] = await setManyDocs({
    docs: [
      {
        collection: '#user',
        doc: {
          key: delegationIdentity.getPrincipal().toText(),
          data: {
            provider: 'webauthn',
            providerData: {
              webauthn: {
                ...(nonNullish(aaguid) && {aaguid: uint8ArrayToArrayOfNumber(aaguid)})
              }
            }
          }
        }
      },
      {
        collection: '#user-webauthn',
        doc: {
          key: passkeyIdentity.getCredential().getCredentialIdText(),
          data: {
            publicKey: passkeyIdentity.getPublicKey().toRaw()
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
