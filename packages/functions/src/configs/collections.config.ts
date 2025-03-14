import * as z from 'zod';

/**
 * Defines the collections where a hook or assertion should run.
 */
export const CollectionsConfigSchema = z.object({
  /**
   * An array containing at least one collection name where the hook or assertion will be executed.
   */
  collections: z.array(z.string()).min(1)
}).strict();

/** @typedef {z.infer<typeof CollectionsConfigSchema>} CollectionsConfig */
export type CollectionsConfig = z.infer<typeof CollectionsConfigSchema>;
