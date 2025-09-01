import type {Doc} from '../../datastore/types/doc';
import type {Provider, ProviderData} from './provider';

/**
 * Interface representing user data.
 * @interface UserData
 */
export interface UserData {
  /**
   * The potential provider used to sign-in. There is no absolute guarantee that the information can be set by the browser during the sign-in flow, therefore it is optional.
   * @type {Provider}
   */
  provider?: Provider;

  /**
   * The optional provider-specific metadata. This is only set if the frontend was able to supply it during the sign-in flow.
   * @type {ProviderData}
   */
  providerData?: ProviderData;
}

/**
 * Type representing a user document.
 * @typedef {Doc<UserData>} User
 */
export type User = Doc<UserData>;
