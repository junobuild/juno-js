import * as z from 'zod/v4';

/**
 * Represents the type of build, stock or extended.
 */
export const BuildSchema = z.enum(['stock', 'extended']);

/**
 * Represents the type of build.
 * @typedef {'stock' | 'extended'} BuildType
 */
export type BuildType = z.infer<typeof BuildSchema>;
