import {PrincipalSchema, Uint8ArraySchema} from '@junobuild/zod';
import * as z from 'zod';
import {zodToRust} from '../../converters/zod-to-rust';

const rust = (id: string, schema: z.ZodType, expected: string) => {
  it(id, () => {
    expect(zodToRust({id, schema, suffix: 'Args'}).code).toBe(expected);
  });
};

const throws = (id: string, schema: z.ZodType) => {
  it(`${id} throws`, () => {
    expect(() => zodToRust({id, schema, suffix: 'Args'})).toThrow();
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
  rust('myFunction', PrincipalSchema, 'pub type MyFunctionArgs = Principal;');
});

// ─── Uint8Array ───────────────────────────────────────────────────────────────

describe('uint8array', () => {
  rust('myFunction', Uint8ArraySchema, 'pub type MyFunctionArgs = Vec<u8>;');

  rust('myFunction', Uint8ArraySchema.optional(), 'pub type MyFunctionArgs = Option<Vec<u8>>;');

  rust(
    'myFunction',
    z.object({value: Uint8ArraySchema}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub value: Vec<u8>,\n}'
  );

  rust(
    'myFunction',
    z.object({value: Uint8ArraySchema.optional()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    pub value: Option<Vec<u8>>,\n}'
  );
});

// ─── Enums ────────────────────────────────────────────────────────────────────

describe('enums', () => {
  rust(
    'myFunction',
    z.enum(['a', 'b']),
    '#[derive(CandidType, Serialize, Deserialize, Clone)]\npub enum MyFunctionArgs {\n    A,\n    B,\n}'
  );

  rust(
    'myFunction',
    z.enum(['active', 'inactive']),
    '#[derive(CandidType, Serialize, Deserialize, Clone)]\npub enum MyFunctionArgs {\n    Active,\n    Inactive,\n}'
  );
});

describe('object with enum field', () => {
  rust(
    'myFunction',
    z.object({status: z.enum(['active', 'inactive'])}),
    [
      '#[derive(CandidType, Serialize, Deserialize, Clone)]\npub enum MyFunctionArgsStatus {\n    Active,\n    Inactive,\n}',
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[json_data(nested)]\n    pub status: MyFunctionArgsStatus,\n}'
    ].join('\n\n')
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
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[json_data(nested)]\n    pub address: MyFunctionArgsAddress,\n}'
    ].join('\n\n')
  );

  rust(
    'myFunction',
    z.object({address: z.object({street: z.string()}).optional()}),
    [
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgsAddress {\n    pub street: String,\n}',
      '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[json_data(nested)]\n    pub address: Option<MyFunctionArgsAddress>,\n}'
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

// ─── Literal (single-tag variant) ────────────────────────────────────────────

describe('literal', () => {
  rust('myFunction', z.literal('active'), 'pub type MyFunctionArgs = String;');
  rust('myFunction', z.literal('pending'), 'pub type MyFunctionArgs = String;');
});

// ─── Discriminated union (variantRecords) ─────────────────────────────────────

describe('discriminated union', () => {
  rust(
    'myFunction',
    z.discriminatedUnion('type', [
      z.object({type: z.literal('active')}),
      z.object({type: z.literal('inactive')})
    ]),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\n#[serde(tag = "type")]\npub enum MyFunctionArgs {\n    #[serde(rename = "active")]\n    Variant0,\n    #[serde(rename = "inactive")]\n    Variant1\n}'
  );

  rust(
    'myFunction',
    z.discriminatedUnion('type', [
      z.object({type: z.literal('active'), owner: PrincipalSchema}),
      z.object({type: z.literal('inactive')}),
      z.object({type: z.literal('pending'), assignee: PrincipalSchema})
    ]),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\n#[serde(tag = "type")]\npub enum MyFunctionArgs {\n    #[serde(rename = "active")]\n    Variant0 {\n        owner: Principal,\n    },\n    #[serde(rename = "inactive")]\n    Variant1,\n    #[serde(rename = "pending")]\n    Variant2 {\n        assignee: Principal,\n    }\n}'
  );
});

describe('reserved keyword field names', () => {
  rust(
    'myFunction',
    z.object({type: z.string()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[serde(rename = "type")]\n    pub r#type: String,\n}'
  );

  rust(
    'myFunction',
    z.object({ref: z.string()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[serde(rename = "ref")]\n    pub r#ref: String,\n}'
  );

  rust(
    'myFunction',
    z.object({self: z.string()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[serde(rename = "self")]\n    pub r#self: String,\n}'
  );
});

describe('reserved keyword field names', () => {
  rust(
    'myFunction',
    z.object({type: z.string()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[serde(rename = "type")]\n    pub r#type: String,\n}'
  );

  rust(
    'myFunction',
    z.object({ref: z.string()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[serde(rename = "ref")]\n    pub r#ref: String,\n}'
  );

  rust(
    'myFunction',
    z.object({self: z.string()}),
    '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]\npub struct MyFunctionArgs {\n    #[serde(rename = "self")]\n    pub r#self: String,\n}'
  );
});

describe('baseName', () => {
  it('should capitalize and append Args', () => {
    const result = zodToRust({id: 'helloWorld', schema: z.string(), suffix: 'Args'});
    expect(result.baseName).toBe('HelloWorldArgs');
  });

  it('should capitalize and append Result', () => {
    const result = zodToRust({id: 'helloWorld', schema: z.string(), suffix: 'Result'});
    expect(result.baseName).toBe('HelloWorldResult');
  });

  it('should handle single word', () => {
    const result = zodToRust({id: 'query', schema: z.string(), suffix: 'Args'});
    expect(result.baseName).toBe('QueryArgs');
  });
});
