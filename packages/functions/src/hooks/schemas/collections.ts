import * as z from 'zod/v4';
import type {Collection} from '../../schemas/satellite';

/**
 * @see Collections
 */
export const CollectionsSchema = z
  .object({
    collections: z.array(z.string()).readonly()
  })
  .strict();

/**
 * Defines the collections where a hook or assertion should run.
 */
export interface Collections {
  /**
   * An array of collection names where the hook or assertion will run.
   * If empty, no hooks or assertions are triggered.
   */
  collections: readonly Collection[];
}
