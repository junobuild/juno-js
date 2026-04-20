import {
  HttpHeaderSchema,
  HttpMethodSchema,
  HttpRequestArgsSchema,
  HttpRequestResultSchema,
  TransformArgsSchema
} from '../../../ic-cdk/schemas/http-request';

describe('ic-cdk > schemas > http-request', () => {
  describe('HttpHeaderSchema', () => {
    it('should validate a valid header', () => {
      expect(() =>
        HttpHeaderSchema.parse({name: 'Content-Type', value: 'application/json'})
      ).not.toThrow();
    });

    it('should reject a header missing name', () => {
      expect(() => HttpHeaderSchema.parse({value: 'application/json'})).toThrow();
    });

    it('should reject a header missing value', () => {
      expect(() => HttpHeaderSchema.parse({name: 'Content-Type'})).toThrow();
    });
  });

  describe('HttpMethodSchema', () => {
    it('should validate GET', () => {
      expect(() => HttpMethodSchema.parse('GET')).not.toThrow();
    });

    it('should validate POST', () => {
      expect(() => HttpMethodSchema.parse('POST')).not.toThrow();
    });

    it('should validate HEAD', () => {
      expect(() => HttpMethodSchema.parse('HEAD')).not.toThrow();
    });

    it('should reject an invalid method', () => {
      expect(() => HttpMethodSchema.parse('DELETE')).toThrow();
    });
  });

  describe('HttpRequestArgsSchema', () => {
    const validArgs = {
      url: 'https://example.com',
      method: 'GET',
      headers: [{name: 'Content-Type', value: 'application/json'}]
    };

    it('should validate valid args', () => {
      expect(() => HttpRequestArgsSchema.parse(validArgs)).not.toThrow();
    });

    it('should validate args with all optional fields', () => {
      expect(() =>
        HttpRequestArgsSchema.parse({
          ...validArgs,
          body: new Uint8Array([1, 2, 3]),
          maxResponseBytes: 1000n,
          transform: 'my_transform',
          isReplicated: false
        })
      ).not.toThrow();
    });

    it('should validate args without optional fields', () => {
      const {headers: _, ...rest} = validArgs;
      expect(() => HttpRequestArgsSchema.parse(rest)).not.toThrow();
    });

    it('should reject an invalid URL', () => {
      expect(() => HttpRequestArgsSchema.parse({...validArgs, url: 'not-a-url'})).toThrow();
    });

    it('should reject an invalid method', () => {
      expect(() => HttpRequestArgsSchema.parse({...validArgs, method: 'DELETE'})).toThrow();
    });

    it('should reject invalid headers', () => {
      expect(() =>
        HttpRequestArgsSchema.parse({...validArgs, headers: [{name: 'Content-Type'}]})
      ).toThrow();
    });
  });

  describe('HttpRequestResultSchema', () => {
    const validResult = {
      status: 200n,
      headers: [{name: 'Content-Type', value: 'application/json'}],
      body: new Uint8Array([1, 2, 3])
    };

    it('should validate a valid result', () => {
      expect(() => HttpRequestResultSchema.parse(validResult)).not.toThrow();
    });

    it('should reject a result missing status', () => {
      const {status: _, ...rest} = validResult;
      expect(() => HttpRequestResultSchema.parse(rest)).toThrow();
    });

    it('should reject a result with non-bigint status', () => {
      expect(() => HttpRequestResultSchema.parse({...validResult, status: 200})).toThrow();
    });

    it('should reject a result missing body', () => {
      const {body: _, ...rest} = validResult;
      expect(() => HttpRequestResultSchema.parse(rest)).toThrow();
    });
  });

  describe('TransformArgsSchema', () => {
    const validTransformArgs = {
      response: {
        status: 200n,
        headers: [{name: 'Content-Type', value: 'application/json'}],
        body: new Uint8Array([1, 2, 3])
      },
      context: new Uint8Array([])
    };

    it('should validate valid transform args', () => {
      expect(() => TransformArgsSchema.parse(validTransformArgs)).not.toThrow();
    });

    it('should reject missing response', () => {
      const {response: _, ...rest} = validTransformArgs;
      expect(() => TransformArgsSchema.parse(rest)).toThrow();
    });

    it('should reject missing context', () => {
      const {context: _, ...rest} = validTransformArgs;
      expect(() => TransformArgsSchema.parse(rest)).toThrow();
    });
  });
});
