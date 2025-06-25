import { z } from 'zod/v4';

/**
 * @see Memory
 */
export const MemorySchema = z.enum(['heap', 'stable']);

/**
 * Memory type used to select storage or datastore location.
 */
export type Memory = z.infer<typeof MemorySchema>;
