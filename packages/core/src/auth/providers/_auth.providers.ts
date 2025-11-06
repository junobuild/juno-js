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
