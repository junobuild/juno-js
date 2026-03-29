import {
  type HttpRequestArgs,
  type HttpRequestResult,
  HttpRequestArgsSchema,
  HttpRequestResultSchema
} from './schemas/http-request';

/**
 * Performs an HTTP request from a Juno serverless function.
 *
 * @param {HttpRequestArgs} args - The HTTP request parameters
 * @returns {Promise<HttpRequestResult>} A promise resolving to the HTTP response.
 * @throws {ZodError} If the provided arguments do not match the expected schema.
 * @throws {Error} If the HTTP request fails.
 */
export const httpRequest = async (args: HttpRequestArgs): Promise<HttpRequestResult> => {
  HttpRequestArgsSchema.parse(args);

  const result = await __ic_cdk_http_request(args);

  return HttpRequestResultSchema.parse(result);
};
