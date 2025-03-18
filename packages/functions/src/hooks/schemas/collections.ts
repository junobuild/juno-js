import * as z from 'zod';

/**
 * @see Collections
 */
export const CollectionsSchema = z
  .object({
    /**
     * An array containing at least one collection name where the hook or assertion will be executed.
     */
    collections: z.array(z.string()).min(1).readonly()
  })
  .strict();

/**
 * Defines the collections where a hook or assertion should run.
 */
export type Collections = z.infer<typeof CollectionsSchema>;
