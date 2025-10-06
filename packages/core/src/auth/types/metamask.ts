import type {SignProgressFn} from './progress';

/**
 * A generic interface for an Ethereum-compatible signer.
 * This allows for compatibility with libraries like ethers.js, viem, etc.
 *
 * The developer is responsible for connecting to the wallet and providing an
 * object that implements this interface.
 */
export interface EthSigner {
  /**
   * Returns the address of the signer.
   * @returns {Promise<string>} A promise that resolves to the Ethereum address.
   */
  getAddress(): Promise<string>;

  /**
   * Signs a message.
   * @param {string} message The message to sign.
   * @returns {Promise<string>} A promise that resolves to the signature as a hex string.
   */
  signMessage(message: string): Promise<string>;
}

/**
 * Enum representing the different steps of the MetaMask sign-in flow.
 */
export enum MetamaskSignInProgressStep {
  /** User is signing the message to generate the identity. */
  Signing,
  /** Completing the session setup after signing. */
  FinalizingSession,
  /** App is creating a new user or retrieving an existing one. */
  CreatingOrRetrievingUser
}

/**
 * Interface representing sign-in options when using the MetaMask provider.
 * @interface MetamaskSignInOptions
 */
export interface MetamaskSignInOptions {
  /**
   * An EIP-1193 compatible signer instance from a library like ethers.js or viem.
   * The developer is responsible for handling the wallet connection.
   */
  signer: EthSigner;

  /**
   * Maximum time to live for the session in milliseconds. Cannot be extended.
   * @type {number}
   */
  maxTimeToLiveInMilliseconds?: number;

  /**
   * Optional callback to receive progress updates about the sign-in flow.
   * Useful for showing UI feedback such as loading indicators or status messages.
   */
  onProgress?: SignProgressFn<MetamaskSignInProgressStep>;
}