import type {InternetIdentityProvider} from '../providers/internet-identity.providers';
import type {NFIDProvider} from '../providers/nfid.providers';
import type {AuthClientSignInOptions} from './auth-client';

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
