import {PrincipalSchema, Uint8ArraySchema} from '@dfinity/zod-schemas';
import * as z from 'zod';
import {jsonToSputnikSchema} from '../_converters';
import {SputnikSchema} from '../_types';

const schema = (
  id: string,
  zodSchema: z.ZodType,
  expected: SputnikSchema,
  isTopLevelOptional = false
) => {
  it(id, () => {
    const result = jsonToSputnikSchema({id, zodSchema});
    expect(result.schema).toEqual(expected);
    expect(result.isTopLevelOptional).toBe(isTopLevelOptional);
  });
};

const throws = (id: string, zodSchema: z.ZodType) => {
  it(`${id} throws`, () => {
    expect(() => jsonToSputnikSchema({id, zodSchema})).toThrow();
  });
};

// ─── Primitives ───────────────────────────────────────────────────────────────

describe('primitives', () => {
  schema('String', z.string(), {kind: 'text'});
  schema('StringMax', z.string().max(10), {kind: 'text'});
  schema('StringMin', z.string().min(1), {kind: 'text'});
  schema('StringEmail', z.email(), {kind: 'text'});
  schema('StringUrl', z.url(), {kind: 'text'});
  schema('StringUuid', z.uuid(), {kind: 'text'});
  schema('StringTrimmed', z.string().trim(), {kind: 'text'});

  schema('Boolean', z.boolean(), {kind: 'bool'});

  schema('Number', z.number(), {kind: 'float64'});
  schema('NumberFloat32', z.float32(), {kind: 'float64'});
  schema('NumberFloat64', z.float64(), {kind: 'float64'});
  schema('NumberMin', z.number().min(0), {kind: 'float64'});
  schema('NumberMax', z.number().max(100), {kind: 'float64'});

  schema('Int', z.int(), {kind: 'int32'});
  schema('Int32', z.int32(), {kind: 'int32'});
  schema('IntMin', z.int().min(0), {kind: 'int32'});

  schema('Bigint', z.bigint(), {kind: 'nat'});
  schema('BigintMin', z.bigint().min(0n), {kind: 'nat'});
  schema('BigintMax', z.bigint().max(100n), {kind: 'nat'});
  schema('Int64', z.int64(), {kind: 'nat'});
  schema('Uint64', z.uint64(), {kind: 'nat'});
});

// ─── Enums ────────────────────────────────────────────────────────────────────

describe('enums', () => {
  schema('EnumSingle', z.enum(['only']), {kind: 'variant', tags: ['only']});
  schema('EnumTwo', z.enum(['a', 'b']), {kind: 'variant', tags: ['a', 'b']});
  schema('EnumThree', z.enum(['a', 'b', 'c']), {kind: 'variant', tags: ['a', 'b', 'c']});
  schema('EnumWithUnderscores', z.enum(['foo_bar', 'baz_qux']), {
    kind: 'variant',
    tags: ['foo_bar', 'baz_qux']
  });

  enum Direction {
    North = 'North',
    South = 'South',
    East = 'East',
    West = 'West'
  }
  schema('NativeEnum', z.enum(Direction), {
    kind: 'variant',
    tags: ['North', 'South', 'East', 'West']
  });
});

// ─── Literals ─────────────────────────────────────────────────────────────────

describe('literals', () => {
  schema('LiteralString', z.literal('hello'), {kind: 'variant', tags: ['hello']});
  schema('LiteralTwo', z.literal(['foo', 'bar']), {kind: 'variant', tags: ['foo', 'bar']});
  schema('LiteralThree', z.literal(['a', 'b', 'c']), {kind: 'variant', tags: ['a', 'b', 'c']});
});

// ─── Objects ──────────────────────────────────────────────────────────────────

describe('objects', () => {
  schema('EmptyObject', z.object({}), {kind: 'record', fields: []});
  schema('SingleField', z.object({name: z.string()}), {
    kind: 'record',
    fields: [{name: 'name', type: {kind: 'text'}}]
  });
  schema('TwoFields', z.object({name: z.string(), age: z.int()}), {
    kind: 'record',
    fields: [
      {name: 'name', type: {kind: 'text'}},
      {name: 'age', type: {kind: 'int32'}}
    ]
  });
  schema('StrictObject', z.strictObject({name: z.string()}), {
    kind: 'record',
    fields: [{name: 'name', type: {kind: 'text'}}]
  });
  schema('LooseObject', z.looseObject({name: z.string()}), {
    kind: 'record',
    fields: [{name: 'name', type: {kind: 'text'}}]
  });

  schema(
    'AllPrimitives',
    z.object({
      text: z.string(),
      bool: z.boolean(),
      float: z.number(),
      int: z.int(),
      nat: z.bigint()
    }),
    {
      kind: 'record',
      fields: [
        {name: 'text', type: {kind: 'text'}},
        {name: 'bool', type: {kind: 'bool'}},
        {name: 'float', type: {kind: 'float64'}},
        {name: 'int', type: {kind: 'int32'}},
        {name: 'nat', type: {kind: 'nat'}}
      ]
    }
  );

  schema('NestedOnce', z.object({outer: z.object({inner: z.string()})}), {
    kind: 'record',
    fields: [
      {name: 'outer', type: {kind: 'record', fields: [{name: 'inner', type: {kind: 'text'}}]}}
    ]
  });

  schema('WithOptionalField', z.object({name: z.string(), age: z.int().optional()}), {
    kind: 'record',
    fields: [
      {name: 'name', type: {kind: 'text'}},
      {name: 'age', type: {kind: 'opt', inner: {kind: 'int32'}}}
    ]
  });

  schema('WithEnum', z.object({status: z.enum(['active', 'inactive'])}), {
    kind: 'record',
    fields: [{name: 'status', type: {kind: 'variant', tags: ['active', 'inactive']}}]
  });

  schema('WithArray', z.object({tags: z.array(z.string())}), {
    kind: 'record',
    fields: [{name: 'tags', type: {kind: 'vec', inner: {kind: 'text'}}}]
  });

  schema('WithRecord', z.object({metadata: z.record(z.string(), z.string())}), {
    kind: 'record',
    fields: [
      {
        name: 'metadata',
        type: {kind: 'vec', inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'text'}]}}
      }
    ]
  });

  schema('WithTuple', z.object({pair: z.tuple([z.string(), z.int()])}), {
    kind: 'record',
    fields: [
      {name: 'pair', type: {kind: 'indexedTuple', members: [{kind: 'text'}, {kind: 'int32'}]}}
    ]
  });

  schema('WithOptionalNested', z.object({address: z.object({street: z.string()}).optional()}), {
    kind: 'record',
    fields: [
      {
        name: 'address',
        type: {
          kind: 'opt',
          inner: {kind: 'record', fields: [{name: 'street', type: {kind: 'text'}}]}
        }
      }
    ]
  });
});

// ─── Principal ────────────────────────────────────────────────────────────────

describe('principal', () => {
  schema('Principal', PrincipalSchema, {kind: 'principal'});

  schema('ObjectWithPrincipal', z.object({value: PrincipalSchema}), {
    kind: 'record',
    fields: [{name: 'value', type: {kind: 'principal'}}]
  });
});

// ─── Uint8Array ───────────────────────────────────────────────────────────────

describe('uint8array', () => {
  schema('Uint8Array', Uint8ArraySchema, {kind: 'uint8array'});

  schema('ObjectWithUint8Array', z.object({value: Uint8ArraySchema}), {
    kind: 'record',
    fields: [{name: 'value', type: {kind: 'uint8array'}}]
  });

  schema('OptionalUint8Array', Uint8ArraySchema.optional(), {kind: 'uint8array'}, true);

  schema('ObjectWithOptionalUint8Array', z.object({value: Uint8ArraySchema.optional()}), {
    kind: 'record',
    fields: [{name: 'value', type: {kind: 'opt', inner: {kind: 'uint8array'}}}]
  });
});

// ─── Optional / Nullable ──────────────────────────────────────────────────────

describe('optional / nullable', () => {
  schema('OptionalString', z.string().optional(), {kind: 'text'}, true);
  schema('OptionalInt', z.int().optional(), {kind: 'int32'}, true);
  schema('OptionalBigint', z.bigint().optional(), {kind: 'nat'}, true);
  schema('OptionalBool', z.boolean().optional(), {kind: 'bool'}, true);
  schema('OptionalFloat', z.number().optional(), {kind: 'float64'}, true);
  schema(
    'OptionalObject',
    z.object({x: z.string()}).optional(),
    {kind: 'record', fields: [{name: 'x', type: {kind: 'text'}}]},
    true
  );
  schema(
    'OptionalArray',
    z.array(z.string()).optional(),
    {kind: 'vec', inner: {kind: 'text'}},
    true
  );
  schema('OptionalEnum', z.enum(['a', 'b']).optional(), {kind: 'variant', tags: ['a', 'b']}, true);

  schema('NullableString', z.string().nullable(), {kind: 'opt', inner: {kind: 'text'}});
  schema('NullableInt', z.int().nullable(), {kind: 'opt', inner: {kind: 'int32'}});
  schema('NullableBigint', z.bigint().nullable(), {kind: 'opt', inner: {kind: 'nat'}});
  schema('NullableObject', z.object({x: z.string()}).nullable(), {
    kind: 'opt',
    inner: {kind: 'record', fields: [{name: 'x', type: {kind: 'text'}}]}
  });

  schema('NullishString', z.string().nullish(), {kind: 'opt', inner: {kind: 'text'}});
  schema('NullishBigint', z.bigint().nullish(), {kind: 'opt', inner: {kind: 'nat'}});
});

// ─── Arrays ───────────────────────────────────────────────────────────────────

describe('arrays', () => {
  schema('ArrayString', z.array(z.string()), {kind: 'vec', inner: {kind: 'text'}});
  schema('ArrayBool', z.array(z.boolean()), {kind: 'vec', inner: {kind: 'bool'}});
  schema('ArrayInt', z.array(z.int()), {kind: 'vec', inner: {kind: 'int32'}});
  schema('ArrayFloat', z.array(z.number()), {kind: 'vec', inner: {kind: 'float64'}});
  schema('ArrayBigint', z.array(z.bigint()), {kind: 'vec', inner: {kind: 'nat'}});
  schema('ArrayNested', z.array(z.array(z.string())), {
    kind: 'vec',
    inner: {kind: 'vec', inner: {kind: 'text'}}
  });
  schema('ArrayObject', z.array(z.object({id: z.bigint()})), {
    kind: 'vec',
    inner: {kind: 'record', fields: [{name: 'id', type: {kind: 'nat'}}]}
  });
  schema('ArrayEnum', z.array(z.enum(['x', 'y', 'z'])), {
    kind: 'vec',
    inner: {kind: 'variant', tags: ['x', 'y', 'z']}
  });
  schema('ArrayRecord', z.array(z.record(z.string(), z.string())), {
    kind: 'vec',
    inner: {kind: 'vec', inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'text'}]}}
  });
  schema('ArrayTuple', z.array(z.tuple([z.string(), z.int()])), {
    kind: 'vec',
    inner: {kind: 'indexedTuple', members: [{kind: 'text'}, {kind: 'int32'}]}
  });
  schema('ArrayOfArrayOfBigint', z.array(z.array(z.bigint())), {
    kind: 'vec',
    inner: {kind: 'vec', inner: {kind: 'nat'}}
  });
});

// ─── Tuples ───────────────────────────────────────────────────────────────────

describe('tuples', () => {
  schema('TupleSingle', z.tuple([z.string()]), {kind: 'indexedTuple', members: [{kind: 'text'}]});
  schema('TupleTwo', z.tuple([z.string(), z.number()]), {
    kind: 'indexedTuple',
    members: [{kind: 'text'}, {kind: 'float64'}]
  });
  schema('TupleThree', z.tuple([z.string(), z.int(), z.boolean()]), {
    kind: 'indexedTuple',
    members: [{kind: 'text'}, {kind: 'int32'}, {kind: 'bool'}]
  });
  schema('TupleWithBigint', z.tuple([z.bigint(), z.string()]), {
    kind: 'indexedTuple',
    members: [{kind: 'nat'}, {kind: 'text'}]
  });
  schema('TupleWithObject', z.tuple([z.string(), z.object({x: z.int()})]), {
    kind: 'indexedTuple',
    members: [{kind: 'text'}, {kind: 'record', fields: [{name: 'x', type: {kind: 'int32'}}]}]
  });
  schema('TupleWithEnum', z.tuple([z.string(), z.enum(['a', 'b'])]), {
    kind: 'indexedTuple',
    members: [{kind: 'text'}, {kind: 'variant', tags: ['a', 'b']}]
  });
  schema('TupleNested', z.tuple([z.tuple([z.string(), z.int()]), z.boolean()]), {
    kind: 'indexedTuple',
    members: [{kind: 'indexedTuple', members: [{kind: 'text'}, {kind: 'int32'}]}, {kind: 'bool'}]
  });
});

// ─── Records ──────────────────────────────────────────────────────────────────

describe('records', () => {
  schema('RecordStringString', z.record(z.string(), z.string()), {
    kind: 'vec',
    inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'text'}]}
  });
  schema('RecordStringNumber', z.record(z.string(), z.number()), {
    kind: 'vec',
    inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'float64'}]}
  });
  schema('RecordStringInt', z.record(z.string(), z.int()), {
    kind: 'vec',
    inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'int32'}]}
  });
  schema('RecordStringBigint', z.record(z.string(), z.bigint()), {
    kind: 'vec',
    inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'nat'}]}
  });
  schema('RecordStringBool', z.record(z.string(), z.boolean()), {
    kind: 'vec',
    inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'bool'}]}
  });
  schema('RecordStringObject', z.record(z.string(), z.object({id: z.bigint()})), {
    kind: 'vec',
    inner: {
      kind: 'tuple',
      members: [{kind: 'text'}, {kind: 'record', fields: [{name: 'id', type: {kind: 'nat'}}]}]
    }
  });
  schema('RecordStringArray', z.record(z.string(), z.array(z.string())), {
    kind: 'vec',
    inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'vec', inner: {kind: 'text'}}]}
  });
  schema('RecordStringEnum', z.record(z.string(), z.enum(['a', 'b'])), {
    kind: 'vec',
    inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'variant', tags: ['a', 'b']}]}
  });
  schema('RecordNested', z.record(z.string(), z.record(z.string(), z.string())), {
    kind: 'vec',
    inner: {
      kind: 'tuple',
      members: [
        {kind: 'text'},
        {kind: 'vec', inner: {kind: 'tuple', members: [{kind: 'text'}, {kind: 'text'}]}}
      ]
    }
  });
});

// ─── Unions ───────────────────────────────────────────────────────────────────

describe('unions', () => {
  schema('UnionTwoLiterals', z.union([z.literal('foo'), z.literal('bar')]), {
    kind: 'variant',
    tags: ['foo', 'bar']
  });
  schema('UnionThreeLiterals', z.union([z.literal('a'), z.literal('b'), z.literal('c')]), {
    kind: 'variant',
    tags: ['a', 'b', 'c']
  });

  schema('UnionObjects', z.union([z.object({a: z.string()}), z.object({b: z.int()})]), {
    kind: 'variantRecords',
    members: [
      {kind: 'record', fields: [{name: 'a', type: {kind: 'text'}}]},
      {kind: 'record', fields: [{name: 'b', type: {kind: 'int32'}}]}
    ]
  });

  schema(
    'UnionThreeObjects',
    z.union([z.object({a: z.string()}), z.object({b: z.int()}), z.object({c: z.boolean()})]),
    {
      kind: 'variantRecords',
      members: [
        {kind: 'record', fields: [{name: 'a', type: {kind: 'text'}}]},
        {kind: 'record', fields: [{name: 'b', type: {kind: 'int32'}}]},
        {kind: 'record', fields: [{name: 'c', type: {kind: 'bool'}}]}
      ]
    }
  );

  schema(
    'UnionOptional',
    z.union([z.literal('foo'), z.literal('bar')]).optional(),
    {kind: 'variant', tags: ['foo', 'bar']},
    true
  );

  schema(
    'DiscriminatedUnion',
    z.discriminatedUnion('type', [
      z.object({type: z.literal('cat'), name: z.string()}),
      z.object({type: z.literal('dog'), breed: z.string()})
    ]),
    {
      kind: 'variantRecords',
      members: [
        {
          kind: 'record',
          fields: [
            {name: 'type', type: {kind: 'variant', tags: ['cat']}},
            {name: 'name', type: {kind: 'text'}}
          ]
        },
        {
          kind: 'record',
          fields: [
            {name: 'type', type: {kind: 'variant', tags: ['dog']}},
            {name: 'breed', type: {kind: 'text'}}
          ]
        }
      ]
    }
  );
});

// ─── Intersections ────────────────────────────────────────────────────────────

describe('intersections', () => {
  schema('IntersectionSimple', z.intersection(z.object({a: z.string()}), z.object({b: z.int()})), {
    kind: 'record',
    fields: [
      {name: 'a', type: {kind: 'text'}},
      {name: 'b', type: {kind: 'int32'}}
    ]
  });

  schema(
    'IntersectionThreeFields',
    z.intersection(z.object({a: z.string(), b: z.boolean()}), z.object({c: z.bigint()})),
    {
      kind: 'record',
      fields: [
        {name: 'a', type: {kind: 'text'}},
        {name: 'b', type: {kind: 'bool'}},
        {name: 'c', type: {kind: 'nat'}}
      ]
    }
  );

  schema(
    'IntersectionWithOptional',
    z.intersection(z.object({a: z.string()}), z.object({b: z.int().optional()})),
    {
      kind: 'record',
      fields: [
        {name: 'a', type: {kind: 'text'}},
        {name: 'b', type: {kind: 'opt', inner: {kind: 'int32'}}}
      ]
    }
  );
});

// ─── Complex combinations ─────────────────────────────────────────────────────

describe('complex', () => {
  schema(
    'DeepComplex',
    z.object({
      users: z.array(
        z.object({
          id: z.bigint(),
          name: z.string(),
          role: z.enum(['admin', 'user']),
          address: z.object({street: z.string(), city: z.string()}).optional(),
          tags: z.array(z.string())
        })
      )
    }),
    {
      kind: 'record',
      fields: [
        {
          name: 'users',
          type: {
            kind: 'vec',
            inner: {
              kind: 'record',
              fields: [
                {name: 'id', type: {kind: 'nat'}},
                {name: 'name', type: {kind: 'text'}},
                {name: 'role', type: {kind: 'variant', tags: ['admin', 'user']}},
                {
                  name: 'address',
                  type: {
                    kind: 'opt',
                    inner: {
                      kind: 'record',
                      fields: [
                        {name: 'street', type: {kind: 'text'}},
                        {name: 'city', type: {kind: 'text'}}
                      ]
                    }
                  }
                },
                {name: 'tags', type: {kind: 'vec', inner: {kind: 'text'}}}
              ]
            }
          }
        }
      ]
    }
  );
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
  throws(
    'Transform',
    z.string().transform((s) => s.length)
  );
  throws(
    'Custom',
    z.custom<string>(() => true)
  );
  throws('UnionWithUndefined', z.union([z.string(), z.undefined()]));
  throws('ArrayWithUndefined', z.array(z.undefined()));
  throws('NonObjectIntersection', z.intersection(z.string(), z.number()));
  throws('ObjectIntersectionWithNonObject', z.intersection(z.object({a: z.string()}), z.string()));
});
