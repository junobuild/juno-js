import type {ReadOptions} from '../types/call-options';

/**
 * Default options for read operations.
 *
 * For backwards compatibility and because most developers probably prioritize speed over
 * additional security when fetching read-only data from the Internet Computer,
 * read operations are performed in an uncertified way by default.
 */
export const DEFAULT_READ_OPTIONS: ReadOptions = {certified: false};
