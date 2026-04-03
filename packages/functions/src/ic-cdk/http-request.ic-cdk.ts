import {nonNullish} from '@junobuild/utils';
import {convertCamelToSnake} from '@junobuild/utils';
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

  const {transform, ...rest} = args;

  const normalizedArgs = {
    ...rest,
    // TODO: app_ duplicates functions-tools BACKEND_FUNCTION_NAMESPACE constants
    ...(nonNullish(transform) && {transform: `app_${convertCamelToSnake(transform)}`})
  };

  const result = await __ic_cdk_http_request(normalizedArgs);

  return HttpRequestResultSchema.parse(result);
};
