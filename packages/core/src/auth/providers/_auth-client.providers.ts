import type {AuthClient, AuthClientCreateOptions} from '@icp-sdk/auth/client';
import {DELEGATION_IDENTITY_EXPIRATION} from '../constants/auth.constants';
import {execute} from '../helpers/progress.helpers';
import {type AuthClientSignInOptions, AuthClientSignInProgressStep} from '../types/auth-client';
import {SignInError} from '../types/errors';
import type {ProviderWithoutData} from '../types/provider';

/**
 * Options for signing in with an authentication provider.
 * @interface AuthProviderSignInOptions
 */
export interface AuthProviderSignInOptions {
  /**
   * The URL of the identity provider - commonly Internet Identity.
   */
  identityProvider: string;
  /**
   * Optional features for the window opener.
   */
  windowOpenerFeatures?: string;
}

/**
 * Abstract base class for all authentication providers that integrate with the `@icp-sdk/auth/client`.
 *
 * @abstract
 * @class AuthClientProvider
 */
export abstract class AuthClientProvider {
  /**
   * The unique identifier of the provider.
   *
   * @abstract
   * @type {Provider}
   */
  abstract get id(): ProviderWithoutData;

  /**
   * Returns the sign-in options for the provider.
   *
   * Note: set as public instead of protected for testing purposes.
   *
   * @abstract
   * @param {Pick<SignInOptions, 'windowed'>} options - Options controlling window behavior.
   * @returns {AuthProviderSignInOptions} Provider-specific sign-in options.
   */
  abstract signInOptions(
    options: Pick<AuthClientSignInOptions, 'windowed'>
  ): AuthProviderSignInOptions;

  /**
   * Signs in a user with the given authentication provider.
   *
   * @param {Object} params - The sign-in parameters.
   * @param {AuthClientSignInOptions} [params.options] - Optional configuration for the sign-in request.
   * @param {createAuthClient} params.createAuthClient - Factory that constructs an AuthClient with the provider options. Provided as a callback to avoid a recursive import of the store.
   * @param {initAuth} params.initAuth - The function to load or initialize the user. Provided as a callback to avoid recursive import.
   *
   * @returns {Promise<void>} Resolves if the sign-in is successful. Rejects with:
   * - {@link SignInError} if the sign-in fails (including when the user cancels).
   */
  async signIn({
    options,
    createAuthClient,
    initAuth
  }: {
    options?: AuthClientSignInOptions;
    createAuthClient: (
      options?: Pick<
        AuthClientCreateOptions,
        'identityProvider' | 'derivationOrigin' | 'windowOpenerFeatures' | 'openIdProvider'
      >
    ) => Promise<AuthClient>;
    initAuth: (params: {provider: ProviderWithoutData}) => Promise<void>;
  }): Promise<void> {
    // 1. Sign-in or sign-up with third party provider
    const login = async () => await this.#signInWithAuthClient({options, createAuthClient});

    await execute({
      fn: login,
      step: AuthClientSignInProgressStep.AuthorizingWithProvider,
      onProgress: options?.onProgress
    });

    // 2. Create or load the user for the authentication
    const runAuth = async () => await initAuth({provider: this.id});

    await execute({
      fn: runAuth,
      step: AuthClientSignInProgressStep.CreatingOrRetrievingUser,
      onProgress: options?.onProgress
    });
  }

  async #signInWithAuthClient({
    options,
    createAuthClient
  }: {
    options?: Omit<AuthClientSignInOptions, 'onProgress'>;
    createAuthClient: (
      options?: Pick<
        AuthClientCreateOptions,
        'identityProvider' | 'derivationOrigin' | 'windowOpenerFeatures' | 'openIdProvider'
      >
    ) => Promise<AuthClient>;
  }): Promise<void> {
    // `@icp-sdk/auth` v7 moved the provider options to construction time, so we
    // build the AuthClient with the provider-specific options here and then call
    // the parameter-light `signIn()`.
    const {identityProvider, windowOpenerFeatures} = this.signInOptions({
      windowed: options?.windowed
    });

    const authClient = await createAuthClient({
      identityProvider,
      ...(windowOpenerFeatures !== undefined && {windowOpenerFeatures}),
      ...(options?.derivationOrigin !== undefined && {derivationOrigin: options.derivationOrigin}),
      // One-click sign-in: forward the chosen OpenID provider so the identity
      // provider authenticates directly with it (e.g. Google).
      ...(options?.openIdProvider !== undefined && {openIdProvider: options.openIdProvider})
    });

    try {
      await authClient.signIn({
        maxTimeToLive: options?.maxTimeToLiveInNanoseconds ?? DELEGATION_IDENTITY_EXPIRATION
      });
    } catch (err: unknown) {
      // v7 `signIn()` throws on any failure, including user cancellation. The
      // `ERROR_USER_INTERRUPT` constant was removed and the signer does not yet
      // expose a typed cancellation error, so every failure maps to
      // `SignInError`. TODO: restore the `SignInUserInterruptError` distinction
      // once the signer surfaces a cancellation error.
      throw new SignInError(err instanceof Error ? err.message : undefined);
    }
  }
}
