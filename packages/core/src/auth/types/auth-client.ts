import type {SignProgressFn} from './progress';

/**
 * Enum representing the different steps of the sign-in flow with Internet Identity or NFID.
 */
export enum AuthClientSignInProgressStep {
  /** User is authenticating with the identity provider (II / NFID). */
  AuthorizingWithProvider,
  /** App is creating a new user or retrieving an existing one after authorization. */
  CreatingOrRetrievingUser
}

/**
 * Interface representing sign-in options when using an AuthClient based provider.
 * @interface AuthClientSignInOptions
 */
export interface AuthClientSignInOptions {
  /**
   * Maximum time to live for the session in nanoseconds. Cannot be extended.
   * @type {bigint}
   */
  maxTimeToLiveInNanoseconds?: bigint;

  /**
   * Origin for derivation. Useful when sign-in using the same domain - e.g. sign-in on www.hello.com for hello.com.
   * @type {(string | URL)}
   */
  derivationOrigin?: string | URL;

  /**
   * Whether to open the sign-in window.
   * @default true
   * @type {boolean}
   */
  windowed?: boolean;

  /**
   * Whether to allow the infamous PIN authentication.
   * @default false
   * @type {boolean}
   */
  allowPin?: boolean;

  /**
   * Optional callback to receive progress updates about the sign-in flow.
   * Useful for showing UI feedback such as loading indicators or status messages.
   */
  onProgress?: SignProgressFn<AuthClientSignInProgressStep>;
}

