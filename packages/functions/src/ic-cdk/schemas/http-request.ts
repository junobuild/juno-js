import {j} from '@junobuild/schema';

/**
 * @see HttpHeader
 */
export const HttpHeaderSchema = j.object({
  name: j.string(),
  value: j.string()
});

/**
 * @see HttpMethod
 */
export const HttpMethodSchema = j.enum(['GET', 'POST', 'HEAD']);

/**
 * @see HttpRequestArgs
 */
export const HttpRequestArgsSchema = j.object({
  url: j.url(),
  method: HttpMethodSchema,
  headers: j.array(HttpHeaderSchema),
  body: j.uint8Array().optional(),
  maxResponseBytes: j.bigint().optional(),
  transform: j.string().optional(),
  isReplicated: j.boolean().optional()
});

/**
 * @see HttpRequestResult
 */
export const HttpRequestResultSchema = j.object({
  status: j.bigint(),
  headers: j.array(HttpHeaderSchema),
  body: j.uint8Array()
});

/**
 * An HTTP header consisting of a name and value.
 */
export interface HttpHeader {
  name: string;
  value: string;
}

/**
 * The HTTP method for the request.
 */
export type HttpMethod = 'GET' | 'POST' | 'HEAD';

/**
 * The arguments for an HTTP request.
 */
export interface HttpRequestArgs {
  url: string;
  method: HttpMethod;
  headers: HttpHeader[];
  body?: Uint8Array;
  maxResponseBytes?: bigint;
  transform?: string;
  isReplicated?: boolean;
}

/**
 * The result of an HTTP request.
 */
export interface HttpRequestResult {
  status: bigint;
  headers: HttpHeader[];
  body: Uint8Array;
}

/**
 * An HTTP header consisting of a name and value.
 */
export interface HttpHeader {
  /**
   * The header name.
   */
  name: string;

  /**
   * The header value.
   */
  value: string;
}

/**
 * The arguments for an HTTP request.
 */
export interface HttpRequestArgs {
  /**
   * The requested URL.
   */
  url: string;

  /**
   * The HTTP method.
   */
  method: HttpMethod;

  /**
   * List of HTTP request headers and their corresponding values.
   */
  headers: HttpHeader[];

  /**
   * Optionally provide request body.
   */
  body?: Uint8Array;

  /**
   * The maximal size of the response in bytes.
   */
  maxResponseBytes?: bigint;

  /**
   * The name of a query function used to transform the response before consensus - for example, to trim headers.
   * If provided, a corresponding query must be declared using {@link defineQuery}.
   */
  transform?: string;

  /**
   * Whether all nodes should perform the request and agree on the response, or just one node.
   * Using a single node is cheaper but the response is not verified by others - suitable when you trust the data source or consistency is not critical.
   * Defaults to all nodes if not specified.
   */
  isReplicated?: boolean;
}

/**
 * The result of an HTTP request.
 */
export interface HttpRequestResult {
  /**
   * The response status (e.g. 200, 404).
   */
  status: bigint;

  /**
   * List of HTTP response headers and their corresponding values.
   */
  headers: HttpHeader[];

  /**
   * The response's body.
   */
  body: Uint8Array;
}
