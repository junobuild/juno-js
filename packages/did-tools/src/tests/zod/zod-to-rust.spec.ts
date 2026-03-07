import {PrincipalSchema} from '@dfinity/zod-schemas';
import * as z from 'zod';
import {zodToRust} from '../../zod/zod-to-rust';

const rust = (id: string, schema: z.ZodType, expected: string) => {
  it(id, () => {
    expect(zodToRust({[id]: schema})).toBe(expected);
  });
};

const throws = (id: string, schema: z.ZodType) => {
  it(`${id} throws`, () => {
    expect(() => zodToRust({[id]: schema})).toThrow();
  });
};

// ─── Primitives ───────────────────────────────────────────────────────────────

describe('primitives', () => {
  rust('myFunction', z.string(), 'pub type MyFunctionArgs = String;');
  rust('myFunction', z.boolean(), 'pub type MyFunctionArgs = bool;');
  rust('myFunction', z.number(), 'pub type MyFunctionArgs = f64;');
  rust('myFunction', z.int(), 'pub type MyFunctionArgs = i32;');
  rust('myFunction', z.bigint(), 'pub type MyFunctionArgs = u64;');
});

// ─── Optional primitives ──────────────────────────────────────────────────────

describe('optional primitives', () => {
  rust('myFunction', z.string().optional(), 'pub type MyFunctionArgs = Option<String>;');
  rust('myFunction', z.int().optional(), 'pub type MyFunctionArgs = Option<i32>;');
  rust('myFunction', z.bigint().optional(), 'pub type MyFunctionArgs = Option<u64>;');
  rust('myFunction', z.string().nullable(), 'pub type MyFunctionArgs = Option<String>;');
  rust('myFunction', z.string().nullish(), 'pub type MyFunctionArgs = Option<String>;');
});

// ─── Principal ────────────────────────────────────────────────────────────────

describe('principal', () => {
  rust('myFunction', PrincipalSchema, 'pub type MyFunctionArgs = candid::Principal;');
});

// ─── Enums ────────────────────────────────────────────────────────────────────

describe('enums', () => {
  rust(
    'myFunction',
    z.enum(['a', 'b']),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub enum MyFunctionArgs {\n    A,\n    B,\n}'
  );

  rust(
    'myFunction',
    z.enum(['active', 'inactive']),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub enum MyFunctionArgs {\n    Active,\n    Inactive,\n}'
  );
});

// ─── Arrays ───────────────────────────────────────────────────────────────────

describe('arrays', () => {
  rust('myFunction', z.array(z.string()), 'pub type MyFunctionArgs = Vec<String>;');
  rust('myFunction', z.array(z.boolean()), 'pub type MyFunctionArgs = Vec<bool>;');
  rust('myFunction', z.array(z.int()), 'pub type MyFunctionArgs = Vec<i32>;');
  rust('myFunction', z.array(z.bigint()), 'pub type MyFunctionArgs = Vec<u64>;');
  rust('myFunction', z.array(z.array(z.string())), 'pub type MyFunctionArgs = Vec<Vec<String>>;');
});

// ─── Objects ──────────────────────────────────────────────────────────────────

describe('objects', () => {
  rust(
    'myFunction',
    z.object({}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n\n}'
  );

  rust(
    'myFunction',
    z.object({name: z.string()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub name: String,\n}'
  );

  rust(
    'myFunction',
    z.object({name: z.string(), age: z.int()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub name: String,\n    pub age: i32,\n}'
  );

  rust(
    'myFunction',
    z.object({name: z.string(), age: z.int().optional()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub name: String,\n    pub age: Option<i32>,\n}'
  );

  rust(
    'myFunction',
    z.object({id: z.bigint(), name: z.string()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub id: u64,\n    pub name: String,\n}'
  );
});

// ─── Nested objects ───────────────────────────────────────────────────────────

describe('nested objects', () => {
  rust(
    'myFunction',
    z.object({address: z.object({street: z.string()})}),
    [
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgsAddress {\n    pub street: String,\n}',
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub address: MyFunctionArgsAddress,\n}'
    ].join('\n\n')
  );

  rust(
    'myFunction',
    z.object({address: z.object({street: z.string()}).optional()}),
    [
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgsAddress {\n    pub street: String,\n}',
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub address: Option<MyFunctionArgsAddress>,\n}'
    ].join('\n\n')
  );
});

// ─── Object with enum field ───────────────────────────────────────────────────

describe('object with enum field', () => {
  rust(
    'myFunction',
    z.object({status: z.enum(['active', 'inactive'])}),
    [
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub enum MyFunctionArgsStatus {\n    Active,\n    Inactive,\n}',
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub status: MyFunctionArgsStatus,\n}'
    ].join('\n\n')
  );
});

// ─── Object with array field ──────────────────────────────────────────────────

describe('object with array field', () => {
  rust(
    'myFunction',
    z.object({tags: z.array(z.string())}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub tags: Vec<String>,\n}'
  );
});

// ─── Tuples ───────────────────────────────────────────────────────────────────

describe('tuples', () => {
  rust('myFunction', z.tuple([z.string(), z.int()]), 'pub type MyFunctionArgs = (String, i32);');
  rust('myFunction', z.tuple([z.bigint(), z.string()]), 'pub type MyFunctionArgs = (u64, String);');
});

// ─── Should throw ─────────────────────────────────────────────────────────────

describe('throws', () => {
  throws('myFunction', z.symbol());
  throws('myFunction', z.void());
  throws('myFunction', z.nan());
  throws('myFunction', z.undefined());
  throws('myFunction', z.null());
  throws('myFunction', z.date());
  throws('myFunction', z.map(z.string(), z.string()));
  throws('myFunction', z.set(z.string()));
});
