import type {SignIdentity} from '@dfinity/agent';
import {IdbStorage, KEY_STORAGE_DELEGATION, KEY_STORAGE_KEY} from '@dfinity/auth-client';
import {
  DelegationChain,
  DelegationIdentity,
  ECDSAKeyIdentity,
  Ed25519KeyIdentity
} from '@dfinity/identity';
import {DELEGATION_IDENTITY_EXPIRATION_IN_MILLISECONDS} from '../constants/auth.constants';
import {execute} from '../helpers/progress.helpers';
import {MetamaskUserInterruptError, SignInInitError} from '../types/errors';
import type {MetamaskSignInOptions} from '../types/metamask';
import {MetamaskSignInProgressStep} from '../types/metamask';
import type {Provider} from '../types/provider';
import type {AuthProvider} from './_auth-client.providers';

interface SessionDelegationIdentity {
  delegationIdentity: DelegationIdentity;
  sessionKey: ECDSAKeyIdentity;
}

const hexToBytes = (hex: string): Uint8Array => {
  const hexString = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes;
};

/**
 * Ethereum Signer authentication provider. This provider impersonates the
 * 'webauthn' provider for backend compatibility.
 *
 * @class MetamaskProvider
 * @implements {AuthProvider}
 */
export class MetamaskProvider implements AuthProvider {
  /**
   * Gets the identifier of the provider.
   * @returns {Provider} Returns 'webauthn' to ensure compatibility with the existing user schema.
   */
  get id(): Provider {
    return 'webauthn';
  }

  /**
   * Signs in a user with an Ethereum-compatible signer.
   *
   * @param {Object} params - The sign-in parameters.
   * @param {MetamaskSignInOptions} params.options - Configuration for the login request, including the signer.
   * @param {initAuth} params.initAuth - The function to load or initialize the user. Provided as a callback to avoid recursive import.
   *
   * @returns {Promise<void>} Resolves if the sign-in is successful.
   */
  async signIn({
    options,
    initAuth
  }: {
    options: MetamaskSignInOptions;
    initAuth: (params: {provider: Provider}) => Promise<void>;
  }) {
    const {signer, appName, onProgress} = options;

    if (!signer) {
      throw new SignInInitError('A signer must be provided for Metamask sign-in.');
    }

    if (!appName) {
      throw new SignInInitError('An appName must be provided for Metamask sign-in.');
    }

    // 1. Sign message to get a seed for the master identity
    const getSeed = async (): Promise<Uint8Array> => {
      if (typeof window === 'undefined' || !window.location?.origin) {
        throw new SignInInitError(
          'Cannot determine the origin for signing. This operation is only supported in a browser environment.'
        );
      }

      const domain = {
        name: appName,
        version: '1',
      };

      const types = {
        SignIn: [
          {name: 'statement', type: 'string'},
          {name: 'address', type: 'string'},
          {name: 'domain', type: 'string'}
        ]
      };

      const address = await signer.getAddress();
      const value = {
        statement: `Sign this message to generate your identity for ${appName}.`,
        address,
        domain: window.location.origin
      };

      try {
        const signature = await signer.signTypedData(domain, types, value);
        const signatureBytes = hexToBytes(signature);

        // Hash the signature to get a 32-byte seed.
        const hashBuffer = await crypto.subtle.digest('SHA-256', signatureBytes as BufferSource);
        return new Uint8Array(hashBuffer);
      } catch (err: unknown) {
        // Most wallet providers will throw an error if the user rejects the request.
        throw new MetamaskUserInterruptError();
      }
    };

    const seed = await execute({
      fn: getSeed,
      step: MetamaskSignInProgressStep.Signing,
      onProgress
    });

    // 2. Create master identity from seed.
    const masterIdentity = Ed25519KeyIdentity.generate(seed);

    // 3. Create session delegation.
    const {delegationIdentity, sessionKey} = await this.#createSessionDelegation({
      identity: masterIdentity,
      maxTimeToLiveInMilliseconds: options?.maxTimeToLiveInMilliseconds
    });

    // 4. Save session identity for AuthClient to load.
    const saveSession = async () =>
      await this.#saveSessionIdentityForAuthClient({delegationIdentity, sessionKey});

    await execute({
      fn: saveSession,
      step: MetamaskSignInProgressStep.FinalizingSession,
      onProgress
    });

    // 5. Create or load the user for the authentication.
    // Because this.id returns 'webauthn', the user document will be created with provider: 'webauthn'.
    const runAuth = async () => await initAuth({provider: this.id});

    await execute({
      fn: runAuth,
      step: MetamaskSignInProgressStep.CreatingOrRetrievingUser,
      onProgress
    });
  }

  async #createSessionDelegation({
    identity,
    maxTimeToLiveInMilliseconds
  }: {identity: SignIdentity} & Pick<
    MetamaskSignInOptions,
    'maxTimeToLiveInMilliseconds'
  >): Promise<SessionDelegationIdentity> {
    // Use ECDSAKeyIdentity for the session key to match the WebAuthn provider's implementation.
    const sessionKey = await ECDSAKeyIdentity.generate({extractable: false});

    const sessionLengthInMilliseconds =
      maxTimeToLiveInMilliseconds ?? DELEGATION_IDENTITY_EXPIRATION_IN_MILLISECONDS;

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