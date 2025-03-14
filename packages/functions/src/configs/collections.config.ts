import * as z from 'zod';

/**
 * @see CollectionsConfig
 */
export const CollectionsConfigSchema = z
  .object({
    /**
     * An array containing at least one collection name where the hook or assertion will be executed.
     */
    collections: z.array(z.string()).min(1)
  })
  .strict();

/**
 * Defines the collections where a hook or assertion should run.
 */
export type CollectionsConfig = z.infer<typeof CollectionsConfigSchema>;
