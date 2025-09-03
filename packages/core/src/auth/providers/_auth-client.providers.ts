import {type AuthClient, ERROR_USER_INTERRUPT} from '@dfinity/auth-client';
import {isNullish} from '@dfinity/utils';
import {
  ALLOW_PIN_AUTHENTICATION,
  DELEGATION_IDENTITY_EXPIRATION
} from '../constants/auth.constants';
import {execute} from '../helpers/progress.helpers';
import {type AuthClientSignInOptions, AuthClientSignInProgressStep} from '../types/auth-client';
import {SignInError, SignInInitError, SignInUserInterruptError} from '../types/errors';
import type {Provider} from '../types/provider';

/**
 * Common traits for all authentication providers
 * @interface AuthProvider
 */
export interface AuthProvider {
  /**
   * The unique identifier of the provider.
   */
  readonly id: Provider;
}

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
 * Abstract base class for all authentication providers that integrate with the `@dfinity/auth-client`.
 *
 * @abstract
 * @class AuthClientProvider
 * @implements {AuthProvider}
 */
export abstract class AuthClientProvider implements AuthProvider {
  /**
   * The unique identifier of the provider.
   *
   * @abstract
   * @type {Provider}
   */
  abstract get id(): Provider;

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
   * @param {AuthClientSignInOptions} [params.options] - Optional configuration for the login request.
   * @param {AuthClient | undefined | null} params.authClient - The AuthClient instance in its current state.
   * @param {initAuth} params.initAuth - The function to load or initialize the user. Provided as a callback to avoid recursive import.
   *
   * @returns {Promise<void>} Resolves if the sign-in is successful. Rejects with:
   * - {@link SignInInitError} if no AuthClient is available.
   * - {@link SignInUserInterruptError} if the user cancels the login.
   * - {@link SignInError} for other errors during sign-in.
   */
  async signIn({
    options,
    authClient,
    initAuth
  }: {
    options?: AuthClientSignInOptions;
    authClient: AuthClient | undefined | null;
    initAuth: (params: {provider: Provider}) => Promise<void>;
  }): Promise<void> {
    // 1. Sign-in or sign-up with third party provider
    const login = async () => await this.#loginWithAuthClient({options, authClient});

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

  #loginWithAuthClient({
    options,
    authClient
  }: {
    options?: Omit<AuthClientSignInOptions, 'onProgress'>;
    authClient: AuthClient | undefined | null;
  }): Promise<void> {
    /* eslint-disable no-async-promise-executor */
    return new Promise<void>(async (resolve, reject) => {
      if (isNullish(authClient)) {
        reject(
          new SignInInitError(
            'No client is ready to perform a sign-in. Have you initialized the Satellite?'
          )
        );
        return;
      }

      await authClient.login({
        onSuccess: resolve,
        onError: (error?: string) => {
          if (error === ERROR_USER_INTERRUPT) {
            reject(new SignInUserInterruptError(error));
            return;
          }

          reject(new SignInError(error));
        },
        maxTimeToLive: options?.maxTimeToLiveInNanoseconds ?? DELEGATION_IDENTITY_EXPIRATION,
        allowPinAuthentication: options?.allowPin ?? ALLOW_PIN_AUTHENTICATION,
        ...(options?.derivationOrigin !== undefined && {
          derivationOrigin: options.derivationOrigin
        }),
        ...this.signInOptions({
          windowed: options?.windowed
        })
      });
    });
  }
}
