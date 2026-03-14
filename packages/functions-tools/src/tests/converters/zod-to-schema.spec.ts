import {PrincipalSchema, Uint8ArraySchema} from '@junobuild/schema';
import * as z from 'zod';
import {zodToSchema} from '../../converters/zod-to-schema';

const zod = (id: string, schema: z.ZodType, expected: string) => {
  it(id, () => {
    expect(zodToSchema({id, schema, suffix: 'Args'}).code).toBe(expected);
  });
};

const throws = (id: string, schema: z.ZodType) => {
  it(`${id} throws`, () => {
    expect(() => zodToSchema({id, schema, suffix: 'Args'})).toThrow();
  });
};

// ─── Primitives ───────────────────────────────────────────────────────────────

describe('primitives', () => {
  zod('myFunction', z.string(), 'const MyFunctionArgsSchema = j.string();');
  zod('myFunction', z.boolean(), 'const MyFunctionArgsSchema = j.boolean();');
  zod('myFunction', z.number(), 'const MyFunctionArgsSchema = j.number();');
  zod('myFunction', z.int(), 'const MyFunctionArgsSchema = j.int();');
  zod('myFunction', z.bigint(), 'const MyFunctionArgsSchema = j.bigint();');
});

// ─── Optional primitives ──────────────────────────────────────────────────────

describe('optional primitives', () => {
  zod('myFunction', z.string().optional(), 'const MyFunctionArgsSchema = j.optional(j.string());');
  zod('myFunction', z.int().optional(), 'const MyFunctionArgsSchema = j.optional(j.int());');
  zod('myFunction', z.bigint().optional(), 'const MyFunctionArgsSchema = j.optional(j.bigint());');
  zod('myFunction', z.string().nullable(), 'const MyFunctionArgsSchema = j.optional(j.string());');
  zod('myFunction', z.string().nullish(), 'const MyFunctionArgsSchema = j.optional(j.string());');
});

// ─── Principal ────────────────────────────────────────────────────────────────

describe('principal', () => {
  zod('myFunction', PrincipalSchema, 'const MyFunctionArgsSchema = j.principal();');
});

// ─── Uint8Array ───────────────────────────────────────────────────────────────

describe('uint8array', () => {
  zod('myFunction', Uint8ArraySchema, 'const MyFunctionArgsSchema = j.uint8Array();');
  zod(
    'myFunction',
    Uint8ArraySchema.optional(),
    'const MyFunctionArgsSchema = j.optional(j.uint8Array());'
  );
  zod(
    'myFunction',
    z.object({value: Uint8ArraySchema}),
    'const MyFunctionArgsSchema = j.strictObject({value: j.uint8Array()});'
  );
  zod(
    'myFunction',
    z.object({value: Uint8ArraySchema.optional()}),
    'const MyFunctionArgsSchema = j.strictObject({value: j.optional(j.uint8Array())});'
  );
});

// ─── Enums ────────────────────────────────────────────────────────────────────

describe('enums', () => {
  zod('myFunction', z.enum(['a', 'b']), "const MyFunctionArgsSchema = j.enum(['a', 'b']);");
  zod(
    'myFunction',
    z.enum(['active', 'inactive']),
    "const MyFunctionArgsSchema = j.enum(['active', 'inactive']);"
  );
});

// ─── Arrays ───────────────────────────────────────────────────────────────────

describe('arrays', () => {
  zod('myFunction', z.array(z.string()), 'const MyFunctionArgsSchema = j.array(j.string());');
  zod('myFunction', z.array(z.boolean()), 'const MyFunctionArgsSchema = j.array(j.boolean());');
  zod('myFunction', z.array(z.int()), 'const MyFunctionArgsSchema = j.array(j.int());');
  zod('myFunction', z.array(z.bigint()), 'const MyFunctionArgsSchema = j.array(j.bigint());');
  zod(
    'myFunction',
    z.array(z.array(z.string())),
    'const MyFunctionArgsSchema = j.array(j.array(j.string()));'
  );
});

// ─── Objects ──────────────────────────────────────────────────────────────────

describe('objects', () => {
  zod('myFunction', z.object({}), 'const MyFunctionArgsSchema = j.strictObject({});');
  zod(
    'myFunction',
    z.object({name: z.string()}),
    'const MyFunctionArgsSchema = j.strictObject({name: j.string()});'
  );
  zod(
    'myFunction',
    z.object({name: z.string(), age: z.int()}),
    'const MyFunctionArgsSchema = j.strictObject({name: j.string(), age: j.int()});'
  );
  zod(
    'myFunction',
    z.object({name: z.string(), age: z.int().optional()}),
    'const MyFunctionArgsSchema = j.strictObject({name: j.string(), age: j.optional(j.int())});'
  );
  zod(
    'myFunction',
    z.object({id: z.bigint(), name: z.string()}),
    'const MyFunctionArgsSchema = j.strictObject({id: j.bigint(), name: j.string()});'
  );
});

// ─── Nested objects ───────────────────────────────────────────────────────────

describe('nested objects', () => {
  zod(
    'myFunction',
    z.object({address: z.object({street: z.string()})}),
    'const MyFunctionArgsSchema = j.strictObject({address: j.strictObject({street: j.string()})});'
  );
  zod(
    'myFunction',
    z.object({address: z.object({street: z.string()}).optional()}),
    'const MyFunctionArgsSchema = j.strictObject({address: j.optional(j.strictObject({street: j.string()}))});'
  );
});

// ─── Object with enum field ───────────────────────────────────────────────────

describe('object with enum field', () => {
  zod(
    'myFunction',
    z.object({status: z.enum(['active', 'inactive'])}),
    "const MyFunctionArgsSchema = j.strictObject({status: j.enum(['active', 'inactive'])});"
  );
});

// ─── Object with array field ──────────────────────────────────────────────────

describe('object with array field', () => {
  zod(
    'myFunction',
    z.object({tags: z.array(z.string())}),
    'const MyFunctionArgsSchema = j.strictObject({tags: j.array(j.string())});'
  );
});

// ─── Tuples ───────────────────────────────────────────────────────────────────

describe('tuples', () => {
  zod(
    'myFunction',
    z.tuple([z.string(), z.int()]),
    'const MyFunctionArgsSchema = j.tuple([j.string(), j.int()]);'
  );
  zod(
    'myFunction',
    z.tuple([z.bigint(), z.string()]),
    'const MyFunctionArgsSchema = j.tuple([j.bigint(), j.string()]);'
  );
});

// ─── Records ──────────────────────────────────────────────────────────────────

describe('records', () => {
  zod(
    'myFunction',
    z.record(z.string(), z.string()),
    'const MyFunctionArgsSchema = j.array(j.tuple([j.string(), j.string()]));'
  );
  zod(
    'myFunction',
    z.record(z.string(), z.int()),
    'const MyFunctionArgsSchema = j.array(j.tuple([j.string(), j.int()]));'
  );
  zod(
    'myFunction',
    z.record(z.string(), z.bigint()),
    'const MyFunctionArgsSchema = j.array(j.tuple([j.string(), j.bigint()]));'
  );
});

// ─── Unions ───────────────────────────────────────────────────────────────────

describe('unions', () => {
  zod(
    'myFunction',
    z.union([z.literal('foo'), z.literal('bar')]),
    "const MyFunctionArgsSchema = j.enum(['foo', 'bar']);"
  );
  zod(
    'myFunction',
    z.discriminatedUnion('type', [
      z.object({type: z.literal('cat'), name: z.string()}),
      z.object({type: z.literal('dog'), breed: z.string()})
    ]),
    "const MyFunctionArgsSchema = j.discriminatedUnion('type', [j.strictObject({type: j.enum(['cat']), name: j.string()}), j.strictObject({type: j.enum(['dog']), breed: j.string()})]);"
  );
});

// ─── Intersections ────────────────────────────────────────────────────────────

describe('intersections', () => {
  zod(
    'myFunction',
    z.intersection(z.object({a: z.string()}), z.object({b: z.int()})),
    'const MyFunctionArgsSchema = j.strictObject({a: j.string(), b: j.int()});'
  );
});

// ─── baseName ─────────────────────────────────────────────────────────────────

describe('baseName', () => {
  it('should capitalize and append Args', () => {
    const result = zodToSchema({id: 'helloWorld', schema: z.string(), suffix: 'Args'});
    expect(result.baseName).toBe('HelloWorldArgs');
  });

  it('should capitalize and append Result', () => {
    const result = zodToSchema({id: 'helloWorld', schema: z.string(), suffix: 'Result'});
    expect(result.baseName).toBe('HelloWorldResult');
  });
});

// ─── Should throw ─────────────────────────────────────────────────────────────

describe('throws', () => {
  throws('Symbol', z.symbol());
  throws('Void', z.void());
  throws('NaN', z.nan());
  throws('Undefined', z.undefined());
  throws('Null', z.null());
  throws('Date', z.date());
  throws('Map', z.map(z.string(), z.string()));
  throws('Set', z.set(z.string()));
  throws('myFunction', z.union([z.object({a: z.string()}), z.object({b: z.int()})]));
});
