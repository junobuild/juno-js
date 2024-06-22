import type {Asset} from '@junobuild/storage';
import type {AssetNoContent} from '../../declarations/satellite/satellite.did';
import type {ListResults} from './list.types';

/**
 * Represents a collection of assets with pagination details.
 * @interface
 * @extends {Pick<ListResults<AssetNoContent>, 'items_length' | 'items_page' | 'matches_length' | 'matches_pages'>}
 */
export interface Assets extends Omit<ListResults<AssetNoContent>, 'items'> {
  /**
   * The collection of assets.
   * @type {Asset[]}
   */
  items: Asset[];
  /**
   * The collection of assets. Duplicates items for backwards compatibility. It will ultimately be removed.
   * @deprecated Use {@link items} instead.
   * @type {Asset[]}
   */
  assets: Asset[];
}
