import type {SignIdentity} from '@dfinity/agent';
import {AnonymousIdentity} from '@dfinity/agent';
import {IdbStorage, KEY_STORAGE_DELEGATION, KEY_STORAGE_KEY} from '@dfinity/auth-client';
import {
  DelegationChain,
  DelegationIdentity,
  DER_COSE_OID,
  ECDSAKeyIdentity,
  unwrapDER
} from '@dfinity/identity';
import {assertNonNullish, uint8ArrayToBase64} from '@dfinity/utils';
import {
  RetrievePublicKeyFn,
  WebAuthnIdentity,
  WebAuthnSignProgressFn
} from '@junobuild/ic-client/webauthn';
import {EnvStore} from '../../core/stores/env.store';
import {getDoc} from '../../datastore/services/doc.services';
import {DELEGATION_IDENTITY_EXPIRATION_IN_MILLISECONDS} from '../constants/auth.constants';
import type {AuthProvider, Provider} from '../types/provider';
import {
  WebAuthnSignInOptions,
  WebAuthnSignProgressFn as WebAuthnSignProviderProgressFn
} from '../types/webauthn';

interface SessionDelegationIdentity {
  delegationIdentity: DelegationIdentity;
  sessionKey: ECDSAKeyIdentity;
}

export class WebauthnProvider implements AuthProvider {
  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider is webauthn.
   */
  get id(): Provider {
    return 'webauthn';
  }

  async signIn({onProgress, maxTimeToLiveInMilliseconds}: WebAuthnSignInOptions = {}) {
    const {satelliteId} = EnvStore.getInstance().get() ?? {satelliteId: undefined};

    // TODO throw better error?
    assertNonNullish(satelliteId);

    const retrievePublicKey: RetrievePublicKeyFn = async ({credentialId}) => {
      const doc = await getDoc({
        collection: '#user-webauthn',
        key: uint8ArrayToBase64(credentialId),
        options: {
          certified: true
        },
        satellite: {
          identity: new AnonymousIdentity(),
          satelliteId
        }
      });

      // TODO: throw comprehensive error
      assertNonNullish(doc);

      const {data} = doc;

      const {publicKey} = data as {publicKey: Uint8Array};

      return unwrapDER(publicKey.buffer as ArrayBuffer, DER_COSE_OID);
    };

    const onSignProgress: WebAuthnSignProgressFn = ({step, state}) => {
      // TODO onProgress
    };

    const passkeyIdentity = await WebAuthnIdentity.createWithExistingCredential({
      retrievePublicKey,
      onProgress: onSignProgress
    });

    // When the signing of the session occurs, the Identity.sign is triggered
    // which in turns lead to:
    // 1. Get passkey (navigator.credentials.get)
    // 2. Retrieve the public key from the backend
    // 3. Create signature
    const {delegationIdentity, sessionKey} = await this.#createSessionDelegation({
      identity: passkeyIdentity,
      maxTimeToLiveInMilliseconds
    });

    await this.#saveSessionIdentityForAuthClient({delegationIdentity, sessionKey});

    // TODO execute
  }

  async #createSessionDelegation({
    identity,
    maxTimeToLiveInMilliseconds
  }: {identity: SignIdentity} & Pick<
    WebAuthnSignInOptions,
    'maxTimeToLiveInMilliseconds'
  >): Promise<SessionDelegationIdentity> {
    const sessionKey = await ECDSAKeyIdentity.generate({extractable: false});

    const sessionLengthInMilliseconds =
      maxTimeToLiveInMilliseconds ?? DELEGATION_IDENTITY_EXPIRATION_IN_MILLISECONDS;

    // We do not provide any particular targets. This delegation is meant to work
    // on the Internet Computer with any canister.
    const chain = await DelegationChain.create(
      identity,
      sessionKey.getPublicKey(),
      new Date(Date.now() + sessionLengthInMilliseconds)
    );

    const delegationIdentity = DelegationIdentity.fromDelegation(sessionKey, chain);

    return {delegationIdentity, sessionKey};
  }

  async #saveSessionIdentityForAuthClient({
    sessionKey,
    delegationIdentity
  }: SessionDelegationIdentity) {
    const storage = new IdbStorage();

    await Promise.all([
      storage.set(KEY_STORAGE_KEY, sessionKey.getKeyPair()),
      storage.set(
        KEY_STORAGE_DELEGATION,
        JSON.stringify(delegationIdentity.getDelegation().toJSON())
      )
    ]);
  }

  async execute<T, Step>({
    fn,
    step,
    onProgress
  }: {
    fn: () => Promise<T>;
    step: Step;
    onProgress?: WebAuthnSignProviderProgressFn<Step>;
  }): Promise<T> {
    onProgress?.({
      step,
      state: 'in_progress'
    });

    try {
      const result = await fn();

      onProgress?.({
        step,
        state: 'success'
      });

      return result;
    } catch (err: unknown) {
      onProgress?.({
        step,
        state: 'error'
      });

      throw err;
    }
  }
}
