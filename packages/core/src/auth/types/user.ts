import type {Doc} from '../../datastore/types/doc';
import type {DeprecatedNfid, ProviderData, ProviderWithoutData} from './provider';

/**
 * Data about the signed-in user.
 */
export type UserData =
  | {
      /**
       * Sign-in via WebAuthn.
       */
      provider: 'webauthn';
      providerData: ProviderData<'webauthn'>;
    }
  | {
      /**
       * Sign-in via Google.
       */
      provider: 'google';
      providerData: ProviderData<'openid'>;
    }
  | {
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
export type UserDataWithoutProviderData = Extract<UserData, {provider?: ProviderWithoutData}>;

/**
 * Type representing a user document.
 * @typedef {Doc<UserData>} User
 */
export type User = Doc<UserData>;
