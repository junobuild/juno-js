/**
 * Internal constant used by Juno's tooling to discover serverless functions.
 * Not intended for direct use by developers.
 */
export const JUNO_FUNCTION_TYPE = {
  QUERY: '__juno_function_query',
  UPDATE: '__juno_function_update'
} as const;
