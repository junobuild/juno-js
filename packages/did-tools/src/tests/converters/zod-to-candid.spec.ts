import {z} from 'zod';
import {zodToCandid} from '../../converters/zod-to-candid';

const candid = (id: string, schema: z.ZodType, expected: string) => {
  it(id, () => {
    expect(zodToCandid({[id]: schema})).toBe(`type ${id} = ${expected};`);
  });
};

const throws = (id: string, schema: z.ZodType) => {
  it(`${id} throws`, () => {
    expect(() => zodToCandid({[id]: schema})).toThrow();
  });
};

// ─── Primitives ───────────────────────────────────────────────────────────────

describe('primitives', () => {
  candid('String', z.string(), 'text');
  candid('StringMax', z.string().max(10), 'text');
  candid('StringMin', z.string().min(1), 'text');
  candid('StringEmail', z.email(), 'text');
  candid('StringUrl', z.url(), 'text');
  candid('StringUuid', z.uuid(), 'text');
  candid('StringTrimmed', z.string().trim(), 'text');

  candid('Boolean', z.boolean(), 'bool');

  candid('Number', z.number(), 'float64');
  candid('NumberFloat32', z.float32(), 'float64');
  candid('NumberFloat64', z.float64(), 'float64');
  candid('NumberMin', z.number().min(0), 'float64');
  candid('NumberMax', z.number().max(100), 'float64');

  candid('Int', z.int(), 'int32');
  candid('Int32', z.int32(), 'int32');
  candid('IntMin', z.int().min(0), 'int32');

  candid('Bigint', z.bigint(), 'nat');
  candid('BigintMin', z.bigint().min(0n), 'nat');
  candid('BigintMax', z.bigint().max(100n), 'nat');
  candid('Int64', z.int64(), 'nat');
  candid('Uint64', z.uint64(), 'nat');
});

// ─── Enums ────────────────────────────────────────────────────────────────────

describe('enums', () => {
  candid('EnumSingle', z.enum(['only']), 'variant { only }');
  candid('EnumTwo', z.enum(['a', 'b']), 'variant { a; b }');
  candid('EnumThree', z.enum(['a', 'b', 'c']), 'variant { a; b; c }');
  candid('EnumWithUnderscores', z.enum(['foo_bar', 'baz_qux']), 'variant { foo_bar; baz_qux }');

  enum Direction {
    North = 'North',
    South = 'South',
    East = 'East',
    West = 'West'
  }
  candid('NativeEnum', z.enum(Direction), 'variant { North; South; East; West }');
});

// ─── Literals ─────────────────────────────────────────────────────────────────

describe('literals', () => {
  candid('LiteralString', z.literal('hello'), 'variant { hello }');
  candid('LiteralTwo', z.literal(['foo', 'bar']), 'variant { foo; bar }');
  candid('LiteralThree', z.literal(['a', 'b', 'c']), 'variant { a; b; c }');
});

// ─── Objects ──────────────────────────────────────────────────────────────────

describe('objects', () => {
  candid('EmptyObject', z.object({}), 'record {}');
  candid('SingleField', z.object({name: z.string()}), 'record { name : text }');
  candid(
    'TwoFields',
    z.object({name: z.string(), age: z.int()}),
    'record { name : text; age : int32 }'
  );
  candid('StrictObject', z.strictObject({name: z.string()}), 'record { name : text }');
  candid('LooseObject', z.looseObject({name: z.string()}), 'record { name : text }');

  candid(
    'AllPrimitives',
    z.object({
      text: z.string(),
      bool: z.boolean(),
      float: z.number(),
      int: z.int(),
      nat: z.bigint()
    }),
    'record { text : text; bool : bool; float : float64; int : int32; nat : nat }'
  );

  candid(
    'NestedOnce',
    z.object({outer: z.object({inner: z.string()})}),
    'record { outer : record { inner : text } }'
  );

  candid(
    'NestedTwice',
    z.object({a: z.object({b: z.object({c: z.string()})})}),
    'record { a : record { b : record { c : text } } }'
  );

  candid(
    'NestedThreeLevels',
    z.object({
      level1: z.object({
        level2: z.object({
          level3: z.object({
            value: z.string()
          })
        })
      })
    }),
    'record { level1 : record { level2 : record { level3 : record { value : text } } } }'
  );

  candid(
    'WithOptionalField',
    z.object({name: z.string(), age: z.int().optional()}),
    'record { name : text; age : opt int32 }'
  );

  candid(
    'AllOptionalFields',
    z.object({a: z.string().optional(), b: z.int().optional()}),
    'record { a : opt text; b : opt int32 }'
  );

  candid(
    'WithEnum',
    z.object({status: z.enum(['active', 'inactive'])}),
    'record { status : variant { active; inactive } }'
  );

  candid('WithArray', z.object({tags: z.array(z.string())}), 'record { tags : vec text }');

  candid(
    'WithRecord',
    z.object({metadata: z.record(z.string(), z.string())}),
    'record { metadata : vec record { text; text } }'
  );

  candid(
    'WithTuple',
    z.object({pair: z.tuple([z.string(), z.int()])}),
    'record { pair : record { 0 : text; 1 : int32 } }'
  );

  candid(
    'WithBigint',
    z.object({id: z.bigint(), name: z.string()}),
    'record { id : nat; name : text }'
  );

  candid(
    'WithOptionalNested',
    z.object({address: z.object({street: z.string()}).optional()}),
    'record { address : opt record { street : text } }'
  );

  candid(
    'Complex',
    z.object({
      id: z.bigint(),
      name: z.string(),
      tags: z.array(z.string()),
      metadata: z.record(z.string(), z.string()),
      status: z.enum(['active', 'inactive']),
      address: z
        .object({
          street: z.string(),
          city: z.string()
        })
        .optional()
    }),
    'record { id : nat; name : text; tags : vec text; metadata : vec record { text; text }; status : variant { active; inactive }; address : opt record { street : text; city : text } }'
  );
});

// ─── Optional / Nullable ──────────────────────────────────────────────────────

describe('optional / nullable', () => {
  candid('OptionalString', z.string().optional(), 'opt text');
  candid('OptionalInt', z.int().optional(), 'opt int32');
  candid('OptionalBigint', z.bigint().optional(), 'opt nat');
  candid('OptionalBool', z.boolean().optional(), 'opt bool');
  candid('OptionalFloat', z.number().optional(), 'opt float64');
  candid('OptionalObject', z.object({x: z.string()}).optional(), 'opt record { x : text }');
  candid('OptionalArray', z.array(z.string()).optional(), 'opt vec text');
  candid('OptionalEnum', z.enum(['a', 'b']).optional(), 'opt variant { a; b }');

  candid('NullableString', z.string().nullable(), 'opt text');
  candid('NullableInt', z.int().nullable(), 'opt int32');
  candid('NullableBigint', z.bigint().nullable(), 'opt nat');
  candid('NullableObject', z.object({x: z.string()}).nullable(), 'opt record { x : text }');

  candid('NullishString', z.string().nullish(), 'opt text');
  candid('NullishBigint', z.bigint().nullish(), 'opt nat');
});

// ─── Arrays ───────────────────────────────────────────────────────────────────

describe('arrays', () => {
  candid('ArrayString', z.array(z.string()), 'vec text');
  candid('ArrayBool', z.array(z.boolean()), 'vec bool');
  candid('ArrayInt', z.array(z.int()), 'vec int32');
  candid('ArrayFloat', z.array(z.number()), 'vec float64');
  candid('ArrayBigint', z.array(z.bigint()), 'vec nat');
  candid('ArrayNested', z.array(z.array(z.string())), 'vec vec text');
  candid('ArrayObject', z.array(z.object({id: z.bigint()})), 'vec record { id : nat }');
  candid('ArrayEnum', z.array(z.enum(['x', 'y', 'z'])), 'vec variant { x; y; z }');
  candid('ArrayOptional', z.array(z.string().optional()), 'vec opt text');
  candid('ArrayRecord', z.array(z.record(z.string(), z.string())), 'vec vec record { text; text }');
  candid(
    'ArrayTuple',
    z.array(z.tuple([z.string(), z.int()])),
    'vec record { 0 : text; 1 : int32 }'
  );
  candid('ArrayOfArrayOfBigint', z.array(z.array(z.bigint())), 'vec vec nat');
});

// ─── Tuples ───────────────────────────────────────────────────────────────────

describe('tuples', () => {
  candid('TupleSingle', z.tuple([z.string()]), 'record { 0 : text }');
  candid('TupleTwo', z.tuple([z.string(), z.number()]), 'record { 0 : text; 1 : float64 }');
  candid(
    'TupleThree',
    z.tuple([z.string(), z.int(), z.boolean()]),
    'record { 0 : text; 1 : int32; 2 : bool }'
  );
  candid('TupleWithBigint', z.tuple([z.bigint(), z.string()]), 'record { 0 : nat; 1 : text }');
  candid(
    'TupleWithObject',
    z.tuple([z.string(), z.object({x: z.int()})]),
    'record { 0 : text; 1 : record { x : int32 } }'
  );
  candid(
    'TupleWithEnum',
    z.tuple([z.string(), z.enum(['a', 'b'])]),
    'record { 0 : text; 1 : variant { a; b } }'
  );
  candid(
    'TupleNested',
    z.tuple([z.tuple([z.string(), z.int()]), z.boolean()]),
    'record { 0 : record { 0 : text; 1 : int32 }; 1 : bool }'
  );
});

// ─── Records ──────────────────────────────────────────────────────────────────

describe('records', () => {
  candid('RecordStringString', z.record(z.string(), z.string()), 'vec record { text; text }');
  candid('RecordStringNumber', z.record(z.string(), z.number()), 'vec record { text; float64 }');
  candid('RecordStringInt', z.record(z.string(), z.int()), 'vec record { text; int32 }');
  candid('RecordStringBigint', z.record(z.string(), z.bigint()), 'vec record { text; nat }');
  candid('RecordStringBool', z.record(z.string(), z.boolean()), 'vec record { text; bool }');
  candid(
    'RecordStringObject',
    z.record(z.string(), z.object({id: z.bigint()})),
    'vec record { text; record { id : nat } }'
  );
  candid(
    'RecordStringArray',
    z.record(z.string(), z.array(z.string())),
    'vec record { text; vec text }'
  );
  candid(
    'RecordStringEnum',
    z.record(z.string(), z.enum(['a', 'b'])),
    'vec record { text; variant { a; b } }'
  );
  candid(
    'RecordNested',
    z.record(z.string(), z.record(z.string(), z.string())),
    'vec record { text; vec record { text; text } }'
  );
});

// ─── Unions ───────────────────────────────────────────────────────────────────

describe('unions', () => {
  candid('UnionTwoLiterals', z.union([z.literal('foo'), z.literal('bar')]), 'variant { foo; bar }');
  candid(
    'UnionThreeLiterals',
    z.union([z.literal('a'), z.literal('b'), z.literal('c')]),
    'variant { a; b; c }'
  );

  candid(
    'UnionObjects',
    z.union([z.object({a: z.string()}), z.object({b: z.int()})]),
    'variant { record { a : text }; record { b : int32 } }'
  );

  candid(
    'UnionThreeObjects',
    z.union([z.object({a: z.string()}), z.object({b: z.int()}), z.object({c: z.boolean()})]),
    'variant { record { a : text }; record { b : int32 }; record { c : bool } }'
  );

  candid(
    'UnionOptional',
    z.union([z.literal('foo'), z.literal('bar')]).optional(),
    'opt variant { foo; bar }'
  );

  candid(
    'DiscriminatedUnion',
    z.discriminatedUnion('type', [
      z.object({type: z.literal('cat'), name: z.string()}),
      z.object({type: z.literal('dog'), breed: z.string()})
    ]),
    'variant { record { type : variant { cat }; name : text }; record { type : variant { dog }; breed : text } }'
  );
});

// ─── Intersections ────────────────────────────────────────────────────────────

describe('intersections', () => {
  candid(
    'IntersectionSimple',
    z.intersection(z.object({a: z.string()}), z.object({b: z.int()})),
    'record { a : text; b : int32 }'
  );

  candid(
    'IntersectionThreeFields',
    z.intersection(z.object({a: z.string(), b: z.boolean()}), z.object({c: z.bigint()})),
    'record { a : text; b : bool; c : nat }'
  );

  candid(
    'IntersectionWithOptional',
    z.intersection(z.object({a: z.string()}), z.object({b: z.int().optional()})),
    'record { a : text; b : opt int32 }'
  );
});

// ─── Complex combinations ─────────────────────────────────────────────────────

describe('complex', () => {
  candid(
    'ArrayOfUnion',
    z.array(z.union([z.object({a: z.string()}), z.object({b: z.int()})])),
    'vec variant { record { a : text }; record { b : int32 } }'
  );

  candid(
    'RecordOfEnum',
    z.record(z.string(), z.enum(['x', 'y'])),
    'vec record { text; variant { x; y } }'
  );

  candid(
    'ObjectWithUnion',
    z.object({
      id: z.bigint(),
      kind: z.union([z.literal('foo'), z.literal('bar')])
    }),
    'record { id : nat; kind : variant { foo; bar } }'
  );

  candid(
    'ObjectWithArrayOfObjects',
    z.object({
      items: z.array(z.object({id: z.bigint(), name: z.string()}))
    }),
    'record { items : vec record { id : nat; name : text } }'
  );

  candid(
    'DeepComplex',
    z.object({
      users: z.array(
        z.object({
          id: z.bigint(),
          name: z.string(),
          role: z.enum(['admin', 'user']),
          address: z
            .object({
              street: z.string(),
              city: z.string()
            })
            .optional(),
          tags: z.array(z.string())
        })
      )
    }),
    'record { users : vec record { id : nat; name : text; role : variant { admin; user }; address : opt record { street : text; city : text }; tags : vec text } }'
  );

  candid(
    'TupleInsideObject',
    z.object({
      coordinates: z.tuple([z.number(), z.number()])
    }),
    'record { coordinates : record { 0 : float64; 1 : float64 } }'
  );

  candid(
    'IntersectionInsideArray',
    z.array(z.intersection(z.object({id: z.bigint()}), z.object({name: z.string()}))),
    'vec record { id : nat; name : text }'
  );

  candid(
    'NestedOptionalRecord',
    z.object({
      config: z.record(z.string(), z.array(z.bigint())).optional()
    }),
    'record { config : opt vec record { text; vec nat } }'
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
