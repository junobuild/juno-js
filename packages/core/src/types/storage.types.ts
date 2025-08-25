import type {SatelliteDid} from '@junobuild/ic-client/actor';
import type {Asset} from '@junobuild/storage';
import type {ListResults} from './list';

/**
 * Represents a collection of assets with pagination details.
 * @interface
 * @extends {Pick<ListResults<AssetNoContent>, 'items_length' | 'items_page' | 'matches_length' | 'matches_pages'>}
 */
export interface Assets extends Omit<ListResults<SatelliteDid.AssetNoContent>, 'items'> {
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
