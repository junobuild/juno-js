import type {DelegationChain, ECDSAKeyIdentity} from '@icp-sdk/core/identity';
import {generateUnsafeDevIdentity} from '@junobuild/ic-client/dev';
import type {DevIdentitySignInOptions} from '../types/dev-identity';
import type {ProviderWithoutData} from '../types/provider';

/**
 * Development identity authentication provider for local testing.
 *
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 * ⚠️ UNSAFE - FOR LOCAL DEVELOPMENT ONLY ⚠️
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 *
 * This provider generates deterministic identities for local development
 * without requiring external authentication services. Only works on localhost.
 *
 * @class DevIdentityProvider
 */
export class DevIdentityProvider {
  /**
   * Signs in a user with a development identity.
   *
   * @param {Object} params - The sign-in parameters.
   * @param {DevIdentitySignInOptions} [params.options] - Optional configuration for the dev identity (identifier, TTL).
   * @param {Function} params.initAuth - Callback to initialize or load the user after identity generation.
   * @param {Function} params.setStorage - Callback to store the session key and delegation chain for AuthClient.
   *
   * @returns {Promise<void>} Resolves when sign-in is complete.
   *
   * @throws {UnsafeDevIdentityNotBrowserError} If called outside browser environment.
   * @throws {UnsafeDevIdentityNotLocalhostError} If called outside localhost.
   * @throws {UnsafeDevIdentityInvalidIdentifierError} If identifier exceeds 32 characters.
   */
  async signIn({
    options,
    initAuth,
    setStorage
  }: {
    options?: DevIdentitySignInOptions;
    initAuth: (params: {provider: ProviderWithoutData}) => Promise<void>;
    setStorage: (params: {
      delegationChain: DelegationChain;
      sessionKey: ECDSAKeyIdentity;
    }) => Promise<void>;
  }): Promise<void> {
    // 1. Create a local identity and save the identifier usage in IDB
    const {sessionKey, delegationChain} = await generateUnsafeDevIdentity(options);

    // 2. We save the session and delegation for use with AuthClient
    await setStorage({sessionKey, delegationChain});

    // 3. Create a new AuthClient, load or create the user
    await initAuth({provider: undefined});
  }
}
