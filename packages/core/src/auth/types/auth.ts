import type {AuthClientSignInOptions, InternetIdentityConfig, NFIDConfig} from './auth-client';

/**
 * The options for sign-in.
 *
 * - `internetIdentity`: Internet Identity config + options
 * - `nfid`: NFID config (required) + popup options
 */
export type SignInOptions =
  | {
      internet_identity: {config?: InternetIdentityConfig; options?: AuthClientSignInOptions};
    }
  | {
      nfid: {config: NFIDConfig; options?: AuthClientSignInOptions};
    };
