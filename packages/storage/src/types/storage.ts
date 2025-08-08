/**
 * Represents the encoding details of an asset.
 * @interface
 */
export interface AssetEncoding {
  /**
   * The timestamp when the encoding was modified.
   * @type {bigint}
   */
  modified: bigint;

  /**
   * The SHA-256 hash of the encoding.
   * @type {string}
   */
  sha256: string;

  /**
   * The total length of the encoding.
   * @type {bigint}
   */
  total_length: bigint;
}

/**
 * Represents the key details of an asset.
 * @interface
 */
export interface AssetKey {
  /**
   * The full path of the asset, i.e., URL.pathname. Except for the dApps assets (HTML, JS, etc.), the full path must start with `/collection/`.
   * @type {string}
   */
  fullPath: string;

  /**
   * The name of the asset.
   * @type {string}
   */
  name: string;

  /**
   * The download URL of the asset.
   * @type {string}
   */
  downloadUrl: string;
}

/**
 * Type representing the possible encoding types.
 * @typedef {('identity' | 'gzip' | 'compress' | 'deflate' | 'br')} ENCODING_TYPE
 */
export type EncodingType = 'identity' | 'gzip' | 'compress' | 'deflate' | 'br';

/**
 * Represents an asset with its key details, encodings, and metadata.
 * @interface
 * @extends {AssetKey}
 */
export interface Asset extends AssetKey {
  /**
   * An optional description of the asset. A field which can be used to filter assets when listing those.
   * @type {string}
   */
  description?: string;

  /**
   * An optional token associated with the asset. Tokens are used to protect assets on the web. If a token is provided, the asset is delivered on the web only if the query parameter `token` is provided with a matching value.
   * @type {string}
   */
  token?: string;

  /**
   * The headers associated with the asset.
   * @type {[string, string][]}
   */
  headers: [string, string][];

  /**
   * The encodings of the asset.
   * @type {Partial<Record<EncodingType, AssetEncoding>>}
   */
  encodings: Partial<Record<EncodingType, AssetEncoding>>;

  /**
   * The owner of the asset.
   * @type {string}
   */
  owner?: string;

  /**
   * The timestamp when the asset was created.
   * @type {bigint}
   */
  created_at?: bigint;

  /**
   * The timestamp when the asset was last updated.
   * @type {bigint}
   */
  updated_at?: bigint;
}

/**
 * Represents the details required to store an asset.
 * @interface
 */
export interface Storage {
  /**
   * The filename of the asset.
   * @type {string}
   */
  filename: string;

  /**
   * The data of the asset.
   * @type {Blob}
   */
  data: Blob;

  /**
   * The collection to which the asset belongs.
   * @type {string}
   */
  collection: string;

  /**
   * The full path of the asset, i.e., URL.pathname. Except for the dApps assets (HTML, JS, etc.), the full path must start with `/collection/`.
   * @type {string}
   */
  fullPath?: string;

  /**
   * The headers associated with the asset.
   * @type {[string, string][]}
   */
  headers?: [string, string][];

  /**
   * An optional token associated with the asset.  Tokens are used to protect assets on the web. If a token is provided, the asset is delivered on the web only if the query parameter `token` is provided with a matching value.
   * @type {string}
   */
  token?: string;

  /**
   * The encoding type of the asset.
   * @type {EncodingType}
   */
  encoding?: EncodingType;

  /**
   * An optional description of the asset. A field which can be used to filter assets when listing those.
   * @type {string}
   */
  description?: string;
}
