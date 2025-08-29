import {type SignIdentity, AnonymousIdentity} from '@dfinity/agent';
import {IdbStorage, KEY_STORAGE_DELEGATION, KEY_STORAGE_KEY} from '@dfinity/auth-client';
import {
  DelegationChain,
  DelegationIdentity,
  DER_COSE_OID,
  ECDSAKeyIdentity,
  unwrapDER
} from '@dfinity/identity';
import {isNullish, uint8ArrayToBase64} from '@dfinity/utils';
import {
  type RetrievePublicKeyFn,
  type WebAuthnSignProgressFn,
  WebAuthnIdentity,
  WebAuthnSignProgressStep
} from '@junobuild/ic-client/webauthn';
import {EnvStore} from '../../core/stores/env.store';
import {getDoc} from '../../datastore/services/doc.services';
import {DELEGATION_IDENTITY_EXPIRATION_IN_MILLISECONDS} from '../constants/auth.constants';
import {SignInInitError, WebAuthnSignInRetrievePublicKeyError} from '../types/errors';
import type {AuthProvider, Provider} from '../types/provider';
import {
  WebAuthnSignInOptions,
  WebAuthnSignInProgressStep,
  WebAuthnSignProgressFn as WebAuthnSignProviderProgressFn
} from '../types/webauthn';

interface SessionDelegationIdentity {
  delegationIdentity: DelegationIdentity;
  sessionKey: ECDSAKeyIdentity;
}

export class WebAuthnProvider implements AuthProvider {
  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider is webauthn.
   */
  get id(): Provider {
    return 'webauthn';
  }

  /**
   * Signs in a user with an existing passkey.
   *
   * @param {Object} params - The sign-in parameters.
   * @param {WebAuthnSignInOptions} [params.options] - Optional configuration for the login request.
   * @param {loadAuth} params.loadAuth - The function to load the user. Provided as a callback to avoid recursive import.
   *
   * @returns {Promise<void>} Resolves if the sign-in is successful.
   */
  async signIn({
    options: {onProgress, maxTimeToLiveInMilliseconds} = {},
    loadAuth
  }: {
    options?: WebAuthnSignInOptions;
    loadAuth: () => Promise<void>;
  }) {
    const {satelliteId} = EnvStore.getInstance().get() ?? {satelliteId: undefined};

    if (isNullish(satelliteId)) {
      throw new SignInInitError('Satellite ID not set. Have you initialized the Satellite?');
    }

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

      if (isNullish(doc)) {
        throw new WebAuthnSignInRetrievePublicKeyError(
          'No public key found for the selected passkey.'
        );
      }

      const {data} = doc;

      const {publicKey} = data as {publicKey: Uint8Array};

      return unwrapDER(publicKey.buffer as ArrayBuffer, DER_COSE_OID);
    };

    const onSignProgress: WebAuthnSignProgressFn = ({step, state}) => {
      switch (step) {
        case WebAuthnSignProgressStep.RequestingUserCredential:
          onProgress?.({
            step: WebAuthnSignInProgressStep.RequestingUserCredential,
            state
          });
          break;
        case WebAuthnSignProgressStep.FinalizingCredential:
          onProgress?.({
            step: WebAuthnSignInProgressStep.FinalizingCredential,
            state
          });
          break;
        case WebAuthnSignProgressStep.Signing:
          onProgress?.({
            step: WebAuthnSignInProgressStep.Signing,
            state
          });
          break;
      }
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

    // 4. Save session identity for loading it with auth client
    const saveSession = async () =>
      await this.#saveSessionIdentityForAuthClient({delegationIdentity, sessionKey});

    await this.#execute({
      fn: saveSession,
      step: WebAuthnSignInProgressStep.FinalizingSession,
      onProgress
    });

    // 5. Load the user
    await this.#execute({
      fn: loadAuth,
      step: WebAuthnSignInProgressStep.RetrievingUser,
      onProgress
    });
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

  async #execute<T, Step>({
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
