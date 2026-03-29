import {httpRequest} from '../../ic-cdk/http-request.ic-cdk';
import type {HttpRequestArgs, HttpRequestResult} from '../../ic-cdk/schemas/http-request';

const mockResult: HttpRequestResult = {
  status: 200n,
  headers: [{name: 'Content-Type', value: 'application/json'}],
  body: new Uint8Array([1, 2, 3])
};

vi.stubGlobal(
  '__ic_cdk_http_request',
  vi.fn(async () => mockResult)
);

describe('ic-cdk > http-request', () => {
  describe('httpRequest function', () => {
    const validArgs: HttpRequestArgs = {
      url: 'https://example.com',
      method: 'GET',
      headers: [{name: 'Content-Type', value: 'application/json'}]
    };

    it('should successfully perform an HTTP request and return the result', async () => {
      const result = await httpRequest(validArgs);
      expect(result).toEqual(mockResult);
    });

    it('should successfully perform a POST request with a body', async () => {
      const result = await httpRequest({
        ...validArgs,
        method: 'POST',
        body: new Uint8Array([1, 2, 3])
      });
      expect(result).toEqual(mockResult);
    });

    it('should successfully perform a request with all optional fields', async () => {
      const result = await httpRequest({
        ...validArgs,
        body: new Uint8Array([1, 2, 3]),
        maxResponseBytes: 1000n,
        transform: 'my_transform',
        isReplicated: false
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw if args do not match the schema', async () => {
      await expect(httpRequest({...validArgs, url: 'not-a-url'})).rejects.toThrow();
    });

    it('should throw if method is invalid', async () => {
      await expect(httpRequest({...validArgs, method: 'DELETE' as 'GET'})).rejects.toThrow();
    });

    it('should throw if the request fails', async () => {
      vi.stubGlobal(
        '__ic_cdk_http_request',
        vi.fn(async () => {
          throw new Error('HTTP request failed');
        })
      );

      await expect(httpRequest(validArgs)).rejects.toThrow('HTTP request failed');
    });

    it('should convert camelCase transform name to snake_case with app_ prefix', async () => {
      const mockFn = vi.fn(async () => mockResult);
      vi.stubGlobal('__ic_cdk_http_request', mockFn);

      await httpRequest({
        ...validArgs,
        transform: 'myHttpTransform'
      });

      expect(mockFn).toHaveBeenCalledWith(
        expect.objectContaining({transform: 'app_my_http_transform'})
      );
    });
  });
});
