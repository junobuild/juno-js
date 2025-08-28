import type {Doc} from '../../datastore/types/doc';
import type {Provider} from './provider';

/**
 * Interface representing user data.
 * @interface UserData
 */
export interface UserData {
  /**
   * The potential provider used to sign-in. There is no guarantee that the information can be set by the browser during the sign-in flow, therefore it is optional.
   * @type {Provider}
   */
  provider?: Provider;
}

/**
 * Type representing a user document.
 * @typedef {Doc<UserData>} User
 */
export type User = Doc<UserData>;
