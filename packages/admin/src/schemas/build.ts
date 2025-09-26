import * as z from 'zod';

/**
 * Represents the type of build, stock or extended.
 */
export const BuildTypeSchema = z.enum(['stock', 'extended']);

/**
 * Represents the type of build.
 * @typedef {'stock' | 'extended'} BuildType
 */
export type BuildType = z.infer<typeof BuildTypeSchema>;
