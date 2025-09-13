import {Cbor, type Signature, SignIdentity} from '@dfinity/agent';
import {arrayBufferToUint8Array, isNullish, uint8ArraysEqual} from '@dfinity/utils';
import {AUTHENTICATOR_ABORT_TIMEOUT} from './_constants';
import {createPasskeyOptions, retrievePasskeyOptions} from './_options';
import {execute} from './_progress';
import {_authDataToCose} from './agent-js/cose-utils';
import {
  type InitWebAuthnNewCredentialArgs,
  type WebAuthnCredential,
  WebAuthnExistingCredential,
  WebAuthnNewCredential
} from './credential';
import {
  WebAuthnIdentityCreateCredentialOnTheDeviceError,
  WebAuthnIdentityCredentialNotInitializedError,
  WebAuthnIdentityCredentialNotPublicKeyError,
  WebAuthnIdentityEncodeCborSignatureError,
  WebAuthnIdentityInvalidCredentialIdError,
  WebAuthnIdentityNoAttestationError,
  WebAuthnIdentityNoAuthenticatorDataError
} from './errors';
import type {
  AuthenticatorOptions,
  CreateWebAuthnIdentityWithExistingCredentialArgs,
  CreateWebAuthnIdentityWithNewCredentialArgs,
  PublicKeyWithToRaw,
  RetrievePublicKeyFn
} from './types/identity';
import type {PasskeyOptions} from './types/passkey';
import {
  type WebAuthnSignProgressArgs,
  type WebAuthnSignProgressFn,
  WebAuthnSignProgressStep
} from './types/progress';

type PublicKeyCredentialWithAttachment = Omit<PublicKeyCredential, 'response'> & {
  response: AuthenticatorAssertionResponse & {
    attestationObject?: ArrayBuffer;
  };
};

const createAbortSignal = ({
  timeout
}: Pick<AuthenticatorOptions<PasskeyOptions>, 'timeout'>): AbortSignal =>
  AbortSignal.timeout(timeout ?? AUTHENTICATOR_ABORT_TIMEOUT);

const retrieveCredentials = async ({
  challenge,
  credentialIds,
  passkeyOptions,
  timeout
}: {
  challenge: Uint8Array;
  credentialIds?: Uint8Array[];
} & AuthenticatorOptions<PasskeyOptions>): Promise<Credential | null> =>
  await navigator.credentials.get({
    publicKey: {
      ...retrievePasskeyOptions(passkeyOptions),
      challenge: challenge.buffer as BufferSource,
      allowCredentials: (credentialIds ?? []).map((id) => ({
        id: id.buffer as BufferSource,
        type: 'public-key'
      }))
    },
    signal: createAbortSignal({timeout})
  });

type WebAuthnState<T extends WebAuthnCredential> =
  | {status: 'pending'; retrievePublicKey: RetrievePublicKeyFn}
  | {status: 'initialized'; credential: T};

const assertWebAuthnStateInitialized: <T extends WebAuthnCredential>(
  state: WebAuthnState<T>
) => asserts state is {
  status: 'initialized';
  credential: T;
} = <T extends WebAuthnCredential>(state: WebAuthnState<T>): void => {
  if (state.status !== 'initialized') {
    throw new WebAuthnIdentityCredentialNotInitializedError();
  }
};

const assertNonNullishCredential: (
  credential: Credential | null
) => asserts credential is Credential = (credential: Credential | null): void => {
  if (isNullish(credential)) {
    throw new WebAuthnIdentityCreateCredentialOnTheDeviceError();
  }
};

const assertCredentialPublicKey: (
  credential: Credential
) => asserts credential is PublicKeyCredentialWithAttachment = ({type}: Credential): void => {
  if (type !== 'public-key') {
    throw new WebAuthnIdentityCredentialNotPublicKeyError();
  }
};

/**
 * A signing identity for the Internet Computer, backed by a WebAuthn credential.
 *
 * Use one of the factory methods to construct an instance:
 * - {@link WebAuthnIdentity.createWithNewCredential} to create a new passkey on the device.
 * - {@link WebAuthnIdentity.createWithExistingCredential} to use an existing passkey.
 *
 * @template T Concrete credential type for this identity
 * ({@link WebAuthnNewCredential} or {@link WebAuthnExistingCredential}).
 */
export class WebAuthnIdentity<T extends WebAuthnCredential> extends SignIdentity {
  readonly #onSignProgress: WebAuthnSignProgressFn | undefined;
  #state: WebAuthnState<T>;

  /**
   * @hidden Use the factory methods instead.
   *
   * Initializes the identity in either:
   * - **pending** state (existing-credential path; public key not yet known), or
   * - **initialized** state (new-credential path; public key known immediately).
   *
   * @private
   */
  private constructor({
    onProgress,
    ...args
  }: WebAuthnSignProgressArgs &
    (
      | InitWebAuthnNewCredentialArgs
      | Pick<CreateWebAuthnIdentityWithExistingCredentialArgs, 'retrievePublicKey'>
    )) {
    super();

    this.#onSignProgress = onProgress;

    if ('retrievePublicKey' in args) {
      const {retrievePublicKey} = args;

      this.#state = {
        status: 'pending',
        retrievePublicKey
      };

      return;
    }

    this.#state = WebAuthnIdentity.#createInitializedState({
      credential: new WebAuthnNewCredential(args)
    });
  }

  static #createInitializedState<T extends WebAuthnCredential>({
    credential
  }: {
    credential: WebAuthnNewCredential | WebAuthnExistingCredential;
  }): WebAuthnState<T> {
    return {
      status: 'initialized',
      credential: credential as T
    };
  }

  /**
   * Creates a new passkey on the device and returns an initialized identity.
   *
   * If you chain `create` and `sign`, the user will be prompted twice to authenticate
   * with their authenticator. You can track progress via the `onProgress` callback.
   *
   * @param args {@link CreateWebAuthnIdentityWithNewCredentialArgs} Options to create the passkey.
   * @returns A {@link WebAuthnIdentity} parameterized with {@link WebAuthnNewCredential}.
   */
  static async createWithNewCredential({
    passkeyOptions,
    timeout,
    ...restArgs
  }: CreateWebAuthnIdentityWithNewCredentialArgs = {}): Promise<
    WebAuthnIdentity<WebAuthnNewCredential>
  > {
    const credential = await navigator.credentials.create({
      publicKey: createPasskeyOptions(passkeyOptions),
      signal: createAbortSignal({timeout})
    });

    assertNonNullishCredential(credential);
    assertCredentialPublicKey(credential);

    const {
      response: {attestationObject},
      rawId
    } = credential;

    if (isNullish(attestationObject)) {
      throw new WebAuthnIdentityNoAttestationError();
    }

    // We have to parse the attestationObject as CBOR to ultimately retrieve the public key.
    // Similar as what's implemented in AgentJS.
    const {authData} = Cbor.decode<{authData: Uint8Array}>(
      arrayBufferToUint8Array(attestationObject)
    );

    const cose = _authDataToCose(authData);

    return new WebAuthnIdentity<WebAuthnNewCredential>({
      ...restArgs,
      rawId: arrayBufferToUint8Array(rawId),
      cose,
      authData
    });
  }

  /**
   * Creates an identity for an existing passkey.
   *
   * @param args {@link CreateWebAuthnIdentityWithExistingCredentialArgs} Options to retrieve the passkey.
   * @returns A {@link WebAuthnIdentity} parameterized with {@link WebAuthnExistingCredential}.
   */
  // We use async for consistency reason and because it might be future prone.
  // eslint-disable-next-line require-await
  static async createWithExistingCredential(
    args: CreateWebAuthnIdentityWithExistingCredentialArgs
  ): Promise<WebAuthnIdentity<WebAuthnExistingCredential>> {
    return new WebAuthnIdentity<WebAuthnExistingCredential>(args);
  }

  /**
   * Returns the credential’s public key.
   *
   * @returns {PublicKey}
   * @throws WebAuthnIdentityCredentialNotInitializedError if the identity has not signed
   * any request yet.
   */
  override getPublicKey(): PublicKeyWithToRaw {
    assertWebAuthnStateInitialized(this.#state);

    const {credential} = this.#state;

    return credential.getPublicKey();
  }

  /**
   * Returns the concrete credential wrapper for this identity.
   *
   * For identities created with:
   * - `createWithNewCredential` → {@link WebAuthnNewCredential}
   * - `createWithExistingCredential` → {@link WebAuthnExistingCredential}
   *
   * @throws WebAuthnIdentityCredentialNotInitializedError if the identity has not signed
   * any request yet.
   */
  getCredential(): T {
    assertWebAuthnStateInitialized(this.#state);

    const {credential} = this.#state;

    return credential;
  }

  /**
   * Signs an arbitrary blob using the platform authenticator.
   *
   * @param blob Bytes to sign (used as the WebAuthn challenge).
   * @returns {Promise<Signature>} CBOR-encoded signature payload.
   */
  override async sign(blob: Uint8Array): Promise<Signature> {
    // 1. Request user credential (navigator.credentials.get)
    const requestCredential = async (): Promise<PublicKeyCredential> => {
      const credential = await retrieveCredentials({
        challenge: blob,
        ...(this.#state.status === 'initialized' && {
          credentialIds: [this.#state.credential.getCredentialId()]
        })
      });

      assertNonNullishCredential(credential);
      assertCredentialPublicKey(credential);

      return credential;
    };

    const credential = await execute({
      fn: requestCredential,
      step: WebAuthnSignProgressStep.RequestingUserCredential,
      onProgress: this.#onSignProgress
    });

    // 2. Assert credential ID if already initialized or load public key from backend and init state
    const finalizingCredential = async () => {
      const {rawId} = credential;

      // If the state was already initialized - credentials.create - then we "only"
      // assert that the rawId retrieved by credentials.get is equals to the one already known.
      if (this.#state.status === 'initialized') {
        if (
          !uint8ArraysEqual({
            a: this.#state.credential.getCredentialId(),
            b: arrayBufferToUint8Array(rawId)
          })
        ) {
          throw new WebAuthnIdentityInvalidCredentialIdError();
        }

        return;
      }

      // If the state was pending, we need to retrieve the public key for the credential
      // that was saved during a previous sign-up
      // because credentials.get does not provide an attestation.
      const {retrievePublicKey} = this.#state;

      const cose = await retrievePublicKey({
        credentialId: arrayBufferToUint8Array(rawId)
      });

      this.#state = WebAuthnIdentity.#createInitializedState({
        credential: new WebAuthnExistingCredential({
          rawId: arrayBufferToUint8Array(rawId),
          cose
        })
      });
    };

    await execute({
      fn: finalizingCredential,
      step: WebAuthnSignProgressStep.FinalizingCredential,
      onProgress: this.#onSignProgress
    });

    // 3. Sign the request
    // eslint-disable-next-line require-await
    const encodeSignature = async (): Promise<Signature> => {
      const {response} = credential;

      const {clientDataJSON} = response;

      // Only the response of type AuthenticatorAssertionResponse provides authenticatorData and signature
      // which is the type of response we are expecting.
      const {authenticatorData, signature} =
        'authenticatorData' in response && 'signature' in response
          ? (response as AuthenticatorAssertionResponse)
          : {};

      if (isNullish(authenticatorData)) {
        throw new WebAuthnIdentityNoAuthenticatorDataError();
      }

      if (isNullish(signature)) {
        throw new WebAuthnIdentityNoAuthenticatorDataError();
      }

      const encoded = Cbor.encode({
        authenticator_data: authenticatorData,
        client_data_json: new TextDecoder().decode(clientDataJSON),
        signature: arrayBufferToUint8Array(signature)
      });

      if (isNullish(encoded)) {
        throw new WebAuthnIdentityEncodeCborSignatureError();
      }

      // Similar as AgentJS code.
      Object.assign(encoded, {
        __signature__: undefined
      });

      return encoded as Signature;
    };

    return await execute({
      fn: encodeSignature,
      step: WebAuthnSignProgressStep.Signing,
      onProgress: this.#onSignProgress
    });
  }
}
