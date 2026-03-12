import {PrincipalSchema, Uint8ArraySchema} from '@dfinity/zod-schemas';
import * as z from 'zod';
import {zodToZod} from '../../converters/zod-to-zod';

const zod = (id: string, schema: z.ZodType, expected: string) => {
  it(id, () => {
    expect(zodToZod({id, schema, suffix: 'Args'}).code).toBe(expected);
  });
};

const throws = (id: string, schema: z.ZodType) => {
  it(`${id} throws`, () => {
    expect(() => zodToZod({id, schema, suffix: 'Args'})).toThrow();
  });
};

// ─── Primitives ───────────────────────────────────────────────────────────────

describe('primitives', () => {
  zod('myFunction', z.string(), 'const MyFunctionArgsSchema = z.string();');
  zod('myFunction', z.boolean(), 'const MyFunctionArgsSchema = z.boolean();');
  zod('myFunction', z.number(), 'const MyFunctionArgsSchema = z.number();');
  zod('myFunction', z.int(), 'const MyFunctionArgsSchema = z.int();');
  zod('myFunction', z.bigint(), 'const MyFunctionArgsSchema = z.bigint();');
});

// ─── Optional primitives ──────────────────────────────────────────────────────

describe('optional primitives', () => {
  zod('myFunction', z.string().optional(), 'const MyFunctionArgsSchema = z.optional(z.string());');
  zod('myFunction', z.int().optional(), 'const MyFunctionArgsSchema = z.optional(z.int());');
  zod('myFunction', z.bigint().optional(), 'const MyFunctionArgsSchema = z.optional(z.bigint());');
  zod('myFunction', z.string().nullable(), 'const MyFunctionArgsSchema = z.optional(z.string());');
  zod('myFunction', z.string().nullish(), 'const MyFunctionArgsSchema = z.optional(z.string());');
});

// ─── Principal ────────────────────────────────────────────────────────────────

describe('principal', () => {
  zod('myFunction', PrincipalSchema, 'const MyFunctionArgsSchema = PrincipalSchema;');
});

// ─── Uint8Array ───────────────────────────────────────────────────────────────

describe('uint8array', () => {
  zod('myFunction', Uint8ArraySchema, 'const MyFunctionArgsSchema = Uint8ArraySchema;');
  zod(
    'myFunction',
    Uint8ArraySchema.optional(),
    'const MyFunctionArgsSchema = z.optional(Uint8ArraySchema);'
  );
  zod(
    'myFunction',
    z.object({value: Uint8ArraySchema}),
    'const MyFunctionArgsSchema = z.strictObject({value: Uint8ArraySchema});'
  );
  zod(
    'myFunction',
    z.object({value: Uint8ArraySchema.optional()}),
    'const MyFunctionArgsSchema = z.strictObject({value: z.optional(Uint8ArraySchema)});'
  );
});

// ─── Enums ────────────────────────────────────────────────────────────────────

describe('enums', () => {
  zod('myFunction', z.enum(['a', 'b']), "const MyFunctionArgsSchema = z.enum(['a', 'b']);");
  zod(
    'myFunction',
    z.enum(['active', 'inactive']),
    "const MyFunctionArgsSchema = z.enum(['active', 'inactive']);"
  );
});

// ─── Arrays ───────────────────────────────────────────────────────────────────

describe('arrays', () => {
  zod('myFunction', z.array(z.string()), 'const MyFunctionArgsSchema = z.array(z.string());');
  zod('myFunction', z.array(z.boolean()), 'const MyFunctionArgsSchema = z.array(z.boolean());');
  zod('myFunction', z.array(z.int()), 'const MyFunctionArgsSchema = z.array(z.int());');
  zod('myFunction', z.array(z.bigint()), 'const MyFunctionArgsSchema = z.array(z.bigint());');
  zod(
    'myFunction',
    z.array(z.array(z.string())),
    'const MyFunctionArgsSchema = z.array(z.array(z.string()));'
  );
});

// ─── Objects ──────────────────────────────────────────────────────────────────

describe('objects', () => {
  zod('myFunction', z.object({}), 'const MyFunctionArgsSchema = z.strictObject({});');
  zod(
    'myFunction',
    z.object({name: z.string()}),
    'const MyFunctionArgsSchema = z.strictObject({name: z.string()});'
  );
  zod(
    'myFunction',
    z.object({name: z.string(), age: z.int()}),
    'const MyFunctionArgsSchema = z.strictObject({name: z.string(), age: z.int()});'
  );
  zod(
    'myFunction',
    z.object({name: z.string(), age: z.int().optional()}),
    'const MyFunctionArgsSchema = z.strictObject({name: z.string(), age: z.optional(z.int())});'
  );
  zod(
    'myFunction',
    z.object({id: z.bigint(), name: z.string()}),
    'const MyFunctionArgsSchema = z.strictObject({id: z.bigint(), name: z.string()});'
  );
});

// ─── Nested objects ───────────────────────────────────────────────────────────

describe('nested objects', () => {
  zod(
    'myFunction',
    z.object({address: z.object({street: z.string()})}),
    'const MyFunctionArgsSchema = z.strictObject({address: z.strictObject({street: z.string()})});'
  );
  zod(
    'myFunction',
    z.object({address: z.object({street: z.string()}).optional()}),
    'const MyFunctionArgsSchema = z.strictObject({address: z.optional(z.strictObject({street: z.string()}))});'
  );
});

// ─── Object with enum field ───────────────────────────────────────────────────

describe('object with enum field', () => {
  zod(
    'myFunction',
    z.object({status: z.enum(['active', 'inactive'])}),
    "const MyFunctionArgsSchema = z.strictObject({status: z.enum(['active', 'inactive'])});"
  );
});

// ─── Object with array field ──────────────────────────────────────────────────

describe('object with array field', () => {
  zod(
    'myFunction',
    z.object({tags: z.array(z.string())}),
    'const MyFunctionArgsSchema = z.strictObject({tags: z.array(z.string())});'
  );
});

// ─── Tuples ───────────────────────────────────────────────────────────────────

describe('tuples', () => {
  zod(
    'myFunction',
    z.tuple([z.string(), z.int()]),
    'const MyFunctionArgsSchema = z.tuple([z.string(), z.int()]);'
  );
  zod(
    'myFunction',
    z.tuple([z.bigint(), z.string()]),
    'const MyFunctionArgsSchema = z.tuple([z.bigint(), z.string()]);'
  );
});

// ─── Records ──────────────────────────────────────────────────────────────────

describe('records', () => {
  zod(
    'myFunction',
    z.record(z.string(), z.string()),
    'const MyFunctionArgsSchema = z.array(z.tuple([z.string(), z.string()]));'
  );
  zod(
    'myFunction',
    z.record(z.string(), z.int()),
    'const MyFunctionArgsSchema = z.array(z.tuple([z.string(), z.int()]));'
  );
  zod(
    'myFunction',
    z.record(z.string(), z.bigint()),
    'const MyFunctionArgsSchema = z.array(z.tuple([z.string(), z.bigint()]));'
  );
});

// ─── Unions ───────────────────────────────────────────────────────────────────

describe('unions', () => {
  zod(
    'myFunction',
    z.union([z.literal('foo'), z.literal('bar')]),
    "const MyFunctionArgsSchema = z.enum(['foo', 'bar']);"
  );
  zod(
    'myFunction',
    z.union([z.object({a: z.string()}), z.object({b: z.int()})]),
    'const MyFunctionArgsSchema = z.union([z.strictObject({a: z.string()}), z.strictObject({b: z.int()})]);'
  );
});

// ─── Intersections ────────────────────────────────────────────────────────────

describe('intersections', () => {
  zod(
    'myFunction',
    z.intersection(z.object({a: z.string()}), z.object({b: z.int()})),
    'const MyFunctionArgsSchema = z.strictObject({a: z.string(), b: z.int()});'
  );
});

// ─── baseName ─────────────────────────────────────────────────────────────────

describe('baseName', () => {
  it('should capitalize and append Args', () => {
    const result = zodToZod({id: 'helloWorld', schema: z.string(), suffix: 'Args'});
    expect(result.baseName).toBe('HelloWorldArgs');
  });

  it('should capitalize and append Result', () => {
    const result = zodToZod({id: 'helloWorld', schema: z.string(), suffix: 'Result'});
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
});
