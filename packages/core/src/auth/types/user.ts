import type {Doc} from '../../datastore/types/doc';
import type {DeprecatedNfid, Provider, ProviderData, ProviderWithoutData} from './provider';

/**
 * All supported authentication providers, plus `undefined` for providers
 * that do not include any associated metadata (see {@link ProviderWithoutData}).
 */
export type UserProvider = Provider | undefined;

/**
 * Data about the signed-in user.
 *
 * Resolves to the appropriate structure based on the provider:
 * - `webauthn` → includes WebAuthn metadata.
 * - `google` → includes OpenID profile metadata.
 * - `internet_identity` / `nfid` / `undefined` → no provider-specific metadata.
 *
 * @template P Authentication provider (defaults to all).
 */
export type UserData<P extends UserProvider = UserProvider> = P extends 'webauthn'
  ? {
      /**
       * Sign-in via WebAuthn.
       */
      provider: 'webauthn';
      providerData: ProviderData<'webauthn'>;
    }
  : P extends 'google'
    ? {
        /**
         * Sign-in via Google.
         */
        provider: 'google';
        providerData: ProviderData<'openid'>;
      }
    : {
        /**
         * Sign-in via another provider. There is no absolute guarantee that the information can be set by the browser
         * during the sign-in flow, therefore it is optional.
         */
        provider?: 'internet_identity' | DeprecatedNfid | undefined;
        providerData?: never;
      };

/**
 *  A simplified version of {@link UserData} for users signed in with providers
 *  that don't include any extra metadata.
 */
export type UserDataWithoutProviderData<P extends UserProvider = UserProvider> = Extract<
  UserData<P>,
  {provider?: ProviderWithoutData}
>;

/**
 * Represents a user's profile, including authentication provider
 * and any associated metadata.
 *
 * @template P Authentication provider (defaults to all).
 */
export type User<P extends UserProvider = UserProvider> = Doc<UserData<P>>;
