import {isNullish, uint8ArrayToBase64} from '@dfinity/utils';
import {IdbStorage, KEY_STORAGE_DELEGATION, KEY_STORAGE_KEY} from '@icp-sdk/auth/client';
import {type SignIdentity, AnonymousIdentity} from '@icp-sdk/core/agent';
import {
  DelegationChain,
  DelegationIdentity,
  DER_COSE_OID,
  ECDSAKeyIdentity,
  unwrapDER
} from '@icp-sdk/core/identity';
import {
  type RetrievePublicKeyFn,
  type WebAuthnNewCredential,
  type WebAuthnSignProgressFn,
  WebAuthnIdentity,
  WebAuthnSignProgressStep
} from '@junobuild/ic-client/webauthn';
import {EnvStore} from '../../core/stores/env.store';
import {getDoc} from '../../datastore/services/doc.services';
import {DELEGATION_IDENTITY_EXPIRATION_IN_MILLISECONDS} from '../constants/auth.constants';
import {execute} from '../helpers/progress.helpers';
import {createWebAuthnUser} from '../services/user-webauthn.services';
import {SignInInitError, WebAuthnSignInRetrievePublicKeyError} from '../types/errors';
import type {Provider} from '../types/provider';
import type {User} from '../types/user';
import {
  type WebAuthnSignInOptions,
  type WebAuthnSignUpOptions,
  WebAuthnSignInProgressStep,
  WebAuthnSignUpProgressStep
} from '../types/webauthn';
import type {AuthProvider} from './_auth.providers';

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
   * Signs up a user by creating a new passkey.
   *
   * @param {Object} params - The sign-up parameters.
   * @param {WebAuthnSignUpOptions} [params.options] - Optional configuration for the login request.
   * @param {loadAuth} params.loadAuthWithUser - The function to load the authentication with the user. Provided as a callback to avoid recursive import.
   *
   * @returns {Promise<void>} Resolves if the sign-up is successful.
   */
  async signUp({
    options: {onProgress, maxTimeToLiveInMilliseconds, passkey: passkeyOptions} = {},
    loadAuthWithUser
  }: {
    options?: WebAuthnSignUpOptions;
    loadAuthWithUser: (params: {user: User}) => Promise<void>;
  }) {
    const {satelliteId} = EnvStore.getInstance().get() ?? {satelliteId: undefined};

    if (isNullish(satelliteId)) {
      throw new SignInInitError('Satellite ID not set. Have you initialized the Satellite?');
    }

    const onSignProgress: WebAuthnSignProgressFn = ({step, state}) => {
      switch (step) {
        case WebAuthnSignProgressStep.RequestingUserCredential:
          onProgress?.({
            step: WebAuthnSignUpProgressStep.ValidatingUserCredential,
            state
          });
          break;
        case WebAuthnSignProgressStep.FinalizingCredential:
          onProgress?.({
            step: WebAuthnSignUpProgressStep.FinalizingCredential,
            state
          });
          break;
        case WebAuthnSignProgressStep.Signing:
          onProgress?.({
            step: WebAuthnSignUpProgressStep.Signing,
            state
          });
          break;
      }
    };

    // 1. Create passkey
    const createPasskey = async (): Promise<WebAuthnIdentity<WebAuthnNewCredential>> =>
      await WebAuthnIdentity.createWithNewCredential({
        onProgress: onSignProgress,
        passkeyOptions
      });

    const passkeyIdentity = await execute({
      fn: createPasskey,
      step: WebAuthnSignUpProgressStep.CreatingUserCredential,
      onProgress
    });

    // 2. Create session delegation. This will require the user the sign the session using their authenticator.
    // i.e. they will have to use their authenticator a second time after create.
    const {delegationIdentity, sessionKey} = await this.#createSessionDelegation({
      identity: passkeyIdentity,
      maxTimeToLiveInMilliseconds
    });

    // 3. Make update calls to create user and save public key.
    // Note: We create the user before saving the session identity to avoid
    // a race condition where the user would reload the window and the lib
    // would try to retrieve and undefined user for the delegation saved in indexeddb.
    const register = async () =>
      await createWebAuthnUser({
        delegationIdentity,
        passkeyIdentity,
        satelliteId
      });

    const user = await execute({
      fn: register,
      step: WebAuthnSignUpProgressStep.RegisteringUser,
      onProgress
    });

    // 4. Save session identity for loading it with auth client
    const saveSession = async () =>
      await this.#saveSessionIdentityForAuthClient({delegationIdentity, sessionKey});

    await execute({
      fn: saveSession,
      step: WebAuthnSignUpProgressStep.FinalizingSession,
      onProgress
    });

    // 5. Load the user for the authentication
    const loadAuth = async () => await loadAuthWithUser({user});

    await execute({
      fn: loadAuth,
      step: WebAuthnSignUpProgressStep.RegisteringUser,
      onProgress
    });
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

      return unwrapDER(publicKey, DER_COSE_OID);
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

    await execute({
      fn: saveSession,
      step: WebAuthnSignInProgressStep.FinalizingSession,
      onProgress
    });

    // 5. Load the user
    await execute({
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
}
