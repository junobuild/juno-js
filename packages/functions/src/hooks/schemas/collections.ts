import * as z from 'zod';

/**
 * @see Collections
 */
export const CollectionsSchema = z
  .object({
    /**
     * An array of collection names where the hook or assertion will run.
     * If empty, no hooks or assertions are triggered.
     */
    collections: z.array(z.string()).readonly()
  })
  .strict();

/**
 * Defines the collections where a hook or assertion should run.
 */
export type Collections = z.infer<typeof CollectionsSchema>;
