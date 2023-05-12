import type {AssetNoContent} from '../../declarations/satellite/satellite.did';
import type {ListResults} from './list.types';

export interface AssetEncoding {
  modified: bigint;
  sha256: string;
  total_length: bigint;
}

export interface AssetKey {
  fullPath: string;
  name: string;
  downloadUrl: string;
}

export type ENCODING_TYPE = 'identity' | 'gzip' | 'compress' | 'deflate' | 'br';

export interface Asset extends AssetKey {
  description?: string;
  token?: string;
  headers: [string, string][];
  encodings: Record<ENCODING_TYPE, AssetEncoding>;
  owner?: string;
  created_at?: bigint;
  updated_at?: bigint;
}

export interface Assets
  extends Pick<
    ListResults<AssetNoContent>,
    'items_length' | 'items_page' | 'matches_length' | 'matches_pages'
  > {
  assets: Asset[];
}

export interface Storage {
  filename: string;
  data: Blob;
  collection: string;
  fullPath?: string;
  headers?: [string, string][];
  token?: string;
  encoding?: ENCODING_TYPE;
  description?: string;
}
