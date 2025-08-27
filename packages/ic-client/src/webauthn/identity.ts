import {Cbor, type PublicKey, type Signature, SignIdentity} from '@dfinity/agent';
import {arrayBufferToUint8Array, isNullish, uint8ArraysEqual} from '@dfinity/utils';
import {AUTHENTICATOR_ABORT_TIMEOUT} from './_constants';
import {createPasskeyOptions, retrievePasskeyOptions} from './_options';
import {execute} from './_progress';
import {_authDataToCose} from './agent-js/cose-utils';
import {type InitWebAuthnCredentialArgs, WebAuthnCredential} from './credential';
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

type WebAuthnState =
  | {status: 'pending'; retrievePublicKey: RetrievePublicKeyFn}
  | {status: 'initialized'; credential: WebAuthnCredential};

const assertWebAuthnStateInitialized: (state: WebAuthnState) => asserts state is {
  status: 'initialized';
  credential: WebAuthnCredential;
} = (state: WebAuthnState): void => {
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

export class WebAuthnIdentity extends SignIdentity {
  readonly #onSignProgress: WebAuthnSignProgressFn | undefined;
  #state: WebAuthnState;

  private constructor({
    onProgress,
    ...args
  }: WebAuthnSignProgressArgs &
    (
      | InitWebAuthnCredentialArgs
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

    this.#state = WebAuthnIdentity.#createInitializedState(args);
  }

  static #createInitializedState(args: InitWebAuthnCredentialArgs): WebAuthnState {
    return {
      status: 'initialized',
      credential: new WebAuthnCredential(args)
    };
  }

  static async createWithNewCredential({
    passkeyOptions,
    timeout,
    ...restArgs
  }: CreateWebAuthnIdentityWithNewCredentialArgs = {}): Promise<WebAuthnIdentity> {
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
    const {authData} = Cbor.decode<{authData: Uint8Array}>(attestationObject);

    const cose = _authDataToCose(authData);

    return new WebAuthnIdentity({
      ...restArgs,
      rawId: arrayBufferToUint8Array(rawId),
      cose
    });
  }

  // We use async for consistency reason and because it might be future prone.
  // eslint-disable-next-line require-await
  static async createWithExistingCredential(
    args: CreateWebAuthnIdentityWithExistingCredentialArgs
  ): Promise<WebAuthnIdentity> {
    return new WebAuthnIdentity(args);
  }

  override getPublicKey(): PublicKey {
    assertWebAuthnStateInitialized(this.#state);

    const {credential} = this.#state;

    return credential.getPublicKey();
  }

  getCredential(): WebAuthnCredential {
    assertWebAuthnStateInitialized(this.#state);

    const {credential} = this.#state;

    return credential;
  }

  override async sign(blob: ArrayBuffer): Promise<Signature> {
    // 1. Request user credential (navigator.credentials.get)
    const requestCredential = async (): Promise<PublicKeyCredential> => {
      const credential = await retrieveCredentials({
        challenge: arrayBufferToUint8Array(blob),
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
        rawId: arrayBufferToUint8Array(rawId),
        cose
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
