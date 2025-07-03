import * as z from 'zod/v4';

/**
 * see EncodingType
 */
export const EncodingTypeSchema = z.enum(['identity', 'gzip', 'compress', 'deflate', 'br']);

/**
 * Represents the encoding types for assets.
 * @typedef {'identity' | 'gzip' | 'compress' | 'deflate' | 'br'} EncodingType
 */
export type EncodingType = 'identity' | 'gzip' | 'compress' | 'deflate' | 'br';
