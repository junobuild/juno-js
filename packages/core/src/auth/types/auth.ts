import type {AuthClientSignInOptions} from './auth-client';
import {InternetIdentityProvider} from '../providers/internet-identity.providers';
import {NFIDProvider} from '../providers/nfid.providers';

/**
 * Interface representing sign-in options.
 * @interface SignInOptions
 */
export interface SignInOptions extends AuthClientSignInOptions {
  /**
   * The authentication provider to use.
   * @default InternetIdentityProvider
   * @type {(InternetIdentityProvider | NFIDProvider)}
   */
  provider?: InternetIdentityProvider | NFIDProvider;
}
