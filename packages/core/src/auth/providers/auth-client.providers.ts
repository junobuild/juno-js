import {type AuthClient, ERROR_USER_INTERRUPT} from '@dfinity/auth-client';
import {isNullish, nonNullish} from '@dfinity/utils';
import {
  DOCKER_CONTAINER_URL,
  DOCKER_INTERNET_IDENTITY_ID
} from '../../core/constants/container.constants';
import {EnvStore} from '../../core/stores/env.store';
import {
  ALLOW_PIN_AUTHENTICATION,
  DELEGATION_IDENTITY_EXPIRATION,
  II_POPUP,
  INTERNET_COMPUTER_ORG,
  NFID_POPUP
} from '../constants/auth.constants';
import {initAuth} from '../services/auth.services';
import type {
  AuthClientSignInOptions,
  InternetIdentityConfig,
  InternetIdentityDomain,
  NFIDConfig
} from '../types/auth-client';
import {SignInError, SignInInitError, SignInUserInterruptError} from '../types/errors';
import type {AuthProvider, Provider} from '../types/provider';
import {popupCenter} from '../utils/window.utils';

/**
 * Options for signing in with an authentication provider.
 * @interface AuthProviderSignInOptions
 */
interface AuthProviderSignInOptions {
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
   * @param {Omit<SignInOptions, 'provider'>} [params.options] - Optional configuration for the login request.
   * @param {AuthClient | undefined | null} params.authClient - The AuthClient instance in its current state.
   *
   * @returns {Promise<void>} Resolves if the sign-in is successful. Rejects with:
   * - {@link SignInInitError} if no AuthClient is available.
   * - {@link SignInUserInterruptError} if the user cancels the login.
   * - {@link SignInError} for other errors during sign-in.
   */
  signIn({
    options,
    authClient
  }: {
    options?: Omit<AuthClientSignInOptions, 'provider'>;
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
        onSuccess: async () => {
          await initAuth(this.id);
          resolve();
        },
        onError: (error?: string) => {
          if (error === ERROR_USER_INTERRUPT) {
            reject(new SignInUserInterruptError(error));
            return;
          }

          reject(new SignInError(error));
        },
        maxTimeToLive: options?.maxTimeToLive ?? DELEGATION_IDENTITY_EXPIRATION,
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

/**
 * Internet Identity authentication provider.
 * @class InternetIdentityProvider
 * @implements {AuthProvider}
 */
export class InternetIdentityProvider extends AuthClientProvider {
  #domain?: InternetIdentityDomain;

  /**
   * Creates an instance of InternetIdentityProvider.
   * @param {InternetIdentityConfig} config - The configuration for Internet Identity.
   */
  constructor({domain}: InternetIdentityConfig) {
    super();

    this.#domain = domain;
  }

  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider - `internet_identity`.
   */
  get id(): Provider {
    return 'internet_identity';
  }

  /**
   * Gets the sign-in options for Internet Identity.
   * @param {Pick<SignInOptions, 'windowed'>} options - The sign-in options.
   * @returns {AuthProviderSignInOptions} The sign-in options for Internet Identity.
   */
  override signInOptions({
    windowed
  }: Pick<AuthClientSignInOptions, 'windowed'>): AuthProviderSignInOptions {
    const identityProviderUrl = (): string => {
      const container = EnvStore.getInstance().get()?.container;

      // Production
      if (isNullish(container) || container === false) {
        return `https://identity.${this.#domain ?? INTERNET_COMPUTER_ORG}`;
      }

      const env = EnvStore.getInstance().get();

      const internetIdentityId =
        nonNullish(env) && nonNullish(env?.internetIdentityId)
          ? env.internetIdentityId
          : DOCKER_INTERNET_IDENTITY_ID;

      const {host: containerHost, protocol} = new URL(
        container === true ? DOCKER_CONTAINER_URL : container
      );

      return /apple/i.test(navigator?.vendor)
        ? `${protocol}//${containerHost}?canisterId=${internetIdentityId}`
        : `${protocol}//${internetIdentityId}.${containerHost.replace('127.0.0.1', 'localhost')}`;
    };

    return {
      ...(windowed !== false && {
        windowOpenerFeatures: popupCenter(II_POPUP)
      }),
      identityProvider: identityProviderUrl()
    };
  }
}

/**
 * NFID authentication provider.
 * @class NFIDProvider
 * @implements {AuthProvider}
 */
export class NFIDProvider extends AuthClientProvider {
  #appName: string;
  #logoUrl: string;

  /**
   * Creates an instance of NFIDProvider.
   * @param {NFIDConfig} config - The configuration for NFID.
   */
  constructor({appName, logoUrl}: NFIDConfig) {
    super();

    this.#appName = appName;
    this.#logoUrl = logoUrl;
  }

  /**
   * Gets the identifier of the provider.
   * @returns {Provider} The identifier of the provider- nfid.
   */
  get id(): Provider {
    return 'nfid';
  }

  /**
   * Gets the sign-in options for NFID.
   * @param {Pick<SignInOptions, 'windowed'>} options - The sign-in options.
   * @returns {AuthProviderSignInOptions} The sign-in options to effectively sign-in with NFID.
   */
  signInOptions({windowed}: Pick<AuthClientSignInOptions, 'windowed'>): AuthProviderSignInOptions {
    return {
      ...(windowed !== false && {
        windowOpenerFeatures: popupCenter(NFID_POPUP)
      }),
      identityProvider: `https://nfid.one/authenticate/?applicationName=${encodeURI(
        this.#appName
      )}&applicationLogo=${encodeURI(this.#logoUrl)}`
    };
  }
}
