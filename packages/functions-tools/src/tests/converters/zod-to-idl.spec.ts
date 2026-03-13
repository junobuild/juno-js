import {IDL} from '@icp-sdk/core/candid';
import {PrincipalSchema, Uint8ArraySchema} from '@junobuild/zod';
import * as z from 'zod';
import {zodToIdl} from '../../converters/zod-to-idl';

const idl = (id: string, schema: z.ZodType, expected: IDL.Type) => {
  it(id, () => {
    const {idl: result} = zodToIdl({id, schema, suffix: 'Args'});
    expect(result.display()).toBe(expected.display());
  });
};

const throws = (id: string, schema: z.ZodType) => {
  it(`${id} throws`, () => {
    expect(() => zodToIdl({id, schema, suffix: 'Args'})).toThrow();
  });
};

// ─── Primitives ───────────────────────────────────────────────────────────────

describe('primitives', () => {
  idl('String', z.string(), IDL.Text);
  idl('Boolean', z.boolean(), IDL.Bool);
  idl('Number', z.number(), IDL.Float64);
  idl('Int', z.int(), IDL.Int32);
  idl('Bigint', z.bigint(), IDL.Nat64);
});

// ─── Optional primitives ──────────────────────────────────────────────────────

describe('optional primitives', () => {
  idl('OptionalString', z.string().optional(), IDL.Opt(IDL.Text));
  idl('OptionalInt', z.int().optional(), IDL.Opt(IDL.Int32));
  idl('OptionalBigint', z.bigint().optional(), IDL.Opt(IDL.Nat64));
  idl('NullableString', z.string().nullable(), IDL.Opt(IDL.Text));
  idl('NullishString', z.string().nullish(), IDL.Opt(IDL.Text));
});

// ─── Principal ────────────────────────────────────────────────────────────────

describe('principal', () => {
  idl('Principal', PrincipalSchema, IDL.Principal);
});

// ─── Uint8Array ───────────────────────────────────────────────────────────────

describe('uint8array', () => {
  idl('Uint8Array', Uint8ArraySchema, IDL.Vec(IDL.Nat8));

  idl(
    'ObjectWithUint8Array',
    z.object({value: Uint8ArraySchema}),
    IDL.Record({value: IDL.Vec(IDL.Nat8)})
  );

  idl('OptionalUint8Array', Uint8ArraySchema.optional(), IDL.Opt(IDL.Vec(IDL.Nat8)));

  idl(
    'ObjectWithOptionalUint8Array',
    z.object({value: Uint8ArraySchema.optional()}),
    IDL.Record({value: IDL.Opt(IDL.Vec(IDL.Nat8))})
  );
});

// ─── Enums ────────────────────────────────────────────────────────────────────

describe('enums', () => {
  idl('EnumTwo', z.enum(['a', 'b']), IDL.Variant({a: IDL.Null, b: IDL.Null}));
  idl(
    'EnumThree',
    z.enum(['active', 'inactive']),
    IDL.Variant({active: IDL.Null, inactive: IDL.Null})
  );
});

// ─── Arrays ───────────────────────────────────────────────────────────────────

describe('arrays', () => {
  idl('ArrayString', z.array(z.string()), IDL.Vec(IDL.Text));
  idl('ArrayBool', z.array(z.boolean()), IDL.Vec(IDL.Bool));
  idl('ArrayInt', z.array(z.int()), IDL.Vec(IDL.Int32));
  idl('ArrayBigint', z.array(z.bigint()), IDL.Vec(IDL.Nat64));
  idl('ArrayNested', z.array(z.array(z.string())), IDL.Vec(IDL.Vec(IDL.Text)));
});

// ─── Objects ──────────────────────────────────────────────────────────────────

describe('objects', () => {
  idl('EmptyObject', z.object({}), IDL.Record({}));
  idl('SingleField', z.object({name: z.string()}), IDL.Record({name: IDL.Text}));
  idl(
    'TwoFields',
    z.object({name: z.string(), age: z.int()}),
    IDL.Record({name: IDL.Text, age: IDL.Int32})
  );
  idl(
    'WithOptionalField',
    z.object({name: z.string(), age: z.int().optional()}),
    IDL.Record({name: IDL.Text, age: IDL.Opt(IDL.Int32)})
  );
  idl(
    'WithBigint',
    z.object({id: z.bigint(), name: z.string()}),
    IDL.Record({id: IDL.Nat64, name: IDL.Text})
  );
});

// ─── Nested objects ───────────────────────────────────────────────────────────

describe('nested objects', () => {
  idl(
    'NestedOnce',
    z.object({outer: z.object({inner: z.string()})}),
    IDL.Record({outer: IDL.Record({inner: IDL.Text})})
  );
  idl(
    'WithOptionalNested',
    z.object({address: z.object({street: z.string()}).optional()}),
    IDL.Record({address: IDL.Opt(IDL.Record({street: IDL.Text}))})
  );
});

// ─── Object with enum field ───────────────────────────────────────────────────

describe('object with enum field', () => {
  idl(
    'WithEnum',
    z.object({status: z.enum(['active', 'inactive'])}),
    IDL.Record({status: IDL.Variant({active: IDL.Null, inactive: IDL.Null})})
  );
});

// ─── Object with array field ──────────────────────────────────────────────────

describe('object with array field', () => {
  idl('WithArray', z.object({tags: z.array(z.string())}), IDL.Record({tags: IDL.Vec(IDL.Text)}));
});

// ─── Tuples ───────────────────────────────────────────────────────────────────

describe('tuples', () => {
  idl('TupleTwo', z.tuple([z.string(), z.int()]), IDL.Tuple(IDL.Text, IDL.Int32));
  idl('TupleWithBigint', z.tuple([z.bigint(), z.string()]), IDL.Tuple(IDL.Nat64, IDL.Text));
});

// ─── Records ──────────────────────────────────────────────────────────────────

describe('records', () => {
  idl(
    'RecordStringString',
    z.record(z.string(), z.string()),
    IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))
  );
  idl('RecordStringInt', z.record(z.string(), z.int()), IDL.Vec(IDL.Tuple(IDL.Text, IDL.Int32)));
  idl(
    'RecordStringBigint',
    z.record(z.string(), z.bigint()),
    IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))
  );
});

// ─── Unions ───────────────────────────────────────────────────────────────────

describe('unions', () => {
  idl(
    'UnionTwoLiterals',
    z.union([z.literal('foo'), z.literal('bar')]),
    IDL.Variant({foo: IDL.Null, bar: IDL.Null})
  );
  idl(
    'UnionObjects',
    z.union([z.object({a: z.string()}), z.object({b: z.int()})]),
    IDL.Variant({Variant0: IDL.Record({a: IDL.Text}), Variant1: IDL.Record({b: IDL.Int32})})
  );
});

// ─── Intersections ────────────────────────────────────────────────────────────

describe('intersections', () => {
  idl(
    'IntersectionSimple',
    z.intersection(z.object({a: z.string()}), z.object({b: z.int()})),
    IDL.Record({a: IDL.Text, b: IDL.Int32})
  );
});

// ─── baseName ─────────────────────────────────────────────────────────────────

describe('baseName', () => {
  it('should capitalize and append Args', () => {
    const result = zodToIdl({id: 'helloWorld', schema: z.string(), suffix: 'Args'});
    expect(result.baseName).toBe('HelloWorldArgs');
  });

  it('should capitalize and append Result', () => {
    const result = zodToIdl({id: 'helloWorld', schema: z.string(), suffix: 'Result'});
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

describe('discriminated union', () => {
  idl(
    'DiscriminatedUnion',
    z.discriminatedUnion('type', [
      z.object({type: z.literal('active'), owner: PrincipalSchema}),
      z.object({type: z.literal('inactive')}),
      z.object({type: z.literal('pending'), assignee: PrincipalSchema})
    ]),
    IDL.Variant({
      active: IDL.Record({owner: IDL.Principal}),
      inactive: IDL.Record({}),
      pending: IDL.Record({assignee: IDL.Principal})
    })
  );
});