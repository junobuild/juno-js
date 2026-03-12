import {PrincipalSchema} from '@junobuild/zod';
import {Principal} from '@icp-sdk/core/principal';
import * as z from 'zod';
import {recursiveFromNullable, recursiveToNullable} from '../did';

describe('did', () => {
  describe('toNullableRecursive', () => {
    describe('primitives', () => {
      it('should pass through string', () => {
        expect(recursiveToNullable({schema: z.string(), value: 'hello'})).toBe('hello');
      });

      it('should pass through number', () => {
        expect(recursiveToNullable({schema: z.number(), value: 42})).toBe(42);
      });

      it('should pass through bigint', () => {
        expect(recursiveToNullable({schema: z.bigint(), value: 42n})).toBe(42n);
      });

      it('should pass through boolean', () => {
        expect(recursiveToNullable({schema: z.boolean(), value: true})).toBe(true);
      });
    });

    describe('optional', () => {
      it('should convert undefined to []', () => {
        expect(recursiveToNullable({schema: z.string().optional(), value: undefined})).toEqual([]);
      });

      it('should convert null to []', () => {
        expect(recursiveToNullable({schema: z.string().nullable(), value: null})).toEqual([]);
      });

      it('should wrap value in [value]', () => {
        expect(recursiveToNullable({schema: z.string().optional(), value: 'hello'})).toEqual([
          'hello'
        ]);
      });

      it('should wrap bigint in [value]', () => {
        expect(recursiveToNullable({schema: z.bigint().optional(), value: 42n})).toEqual([42n]);
      });

      it('should wrap number in [value]', () => {
        expect(recursiveToNullable({schema: z.number().optional(), value: 42})).toEqual([42]);
      });

      it('should wrap boolean in [value]', () => {
        expect(recursiveToNullable({schema: z.boolean().optional(), value: true})).toEqual([true]);
      });
    });

    describe('objects', () => {
      it('should pass through object with no optional fields', () => {
        const schema = z.object({name: z.string(), age: z.number()});
        expect(recursiveToNullable({schema, value: {name: 'hello', age: 42}})).toEqual({
          name: 'hello',
          age: 42
        });
      });

      it('should convert undefined field to []', () => {
        const schema = z.object({name: z.string(), age: z.number().optional()});
        expect(recursiveToNullable({schema, value: {name: 'hello', age: undefined}})).toEqual({
          name: 'hello',
          age: []
        });
      });

      it('should wrap optional field value in [value]', () => {
        const schema = z.object({name: z.string(), age: z.number().optional()});
        expect(recursiveToNullable({schema, value: {name: 'hello', age: 42}})).toEqual({
          name: 'hello',
          age: [42]
        });
      });

      it('should handle multiple optional fields', () => {
        const schema = z.object({a: z.string().optional(), b: z.number().optional()});
        expect(recursiveToNullable({schema, value: {a: 'hello', b: undefined}})).toEqual({
          a: ['hello'],
          b: []
        });
      });

      it('should handle empty object', () => {
        expect(recursiveToNullable({schema: z.object({}), value: {}})).toEqual({});
      });
    });

    describe('nested objects', () => {
      it('should recursively process nested object', () => {
        const schema = z.object({
          address: z.object({street: z.string(), city: z.string().optional()})
        });
        expect(
          recursiveToNullable({schema, value: {address: {street: 'main', city: undefined}}})
        ).toEqual({address: {street: 'main', city: []}});
      });

      it('should handle optional nested object', () => {
        const schema = z.object({address: z.object({street: z.string()}).optional()});
        expect(recursiveToNullable({schema, value: {address: undefined}})).toEqual({address: []});
        expect(recursiveToNullable({schema, value: {address: {street: 'main'}}})).toEqual({
          address: [{street: 'main'}]
        });
      });
    });

    describe('arrays', () => {
      it('should pass through array of strings', () => {
        expect(recursiveToNullable({schema: z.array(z.string()), value: ['a', 'b']})).toEqual([
          'a',
          'b'
        ]);
      });

      it('should pass through array of numbers', () => {
        expect(recursiveToNullable({schema: z.array(z.number()), value: [1, 2, 3]})).toEqual([
          1, 2, 3
        ]);
      });

      it('should recursively process array of objects', () => {
        const schema = z.array(z.object({name: z.string(), age: z.number().optional()}));
        expect(
          recursiveToNullable({
            schema,
            value: [
              {name: 'hello', age: 42},
              {name: 'world', age: undefined}
            ]
          })
        ).toEqual([
          {name: 'hello', age: [42]},
          {name: 'world', age: []}
        ]);
      });

      it('should handle array of optional values', () => {
        const schema = z.array(z.string().optional());
        expect(recursiveToNullable({schema, value: ['hello', undefined]})).toEqual([['hello'], []]);
      });
    });

    describe('principal', () => {
      it('should pass through principal', () => {
        const principal = Principal.fromText('aaaaa-aa');
        expect(recursiveToNullable({schema: PrincipalSchema, value: principal})).toEqual(principal);
      });

      it('should wrap optional principal', () => {
        const principal = Principal.fromText('aaaaa-aa');
        expect(recursiveToNullable({schema: PrincipalSchema.optional(), value: principal})).toEqual(
          [principal]
        );
      });

      it('should convert undefined optional principal to []', () => {
        expect(recursiveToNullable({schema: PrincipalSchema.optional(), value: undefined})).toEqual(
          []
        );
      });

      it('should handle object with principal field', () => {
        const schema = z.object({id: PrincipalSchema, name: z.string()});
        const principal = Principal.fromText('aaaaa-aa');
        expect(recursiveToNullable({schema, value: {id: principal, name: 'hello'}})).toEqual({
          id: principal,
          name: 'hello'
        });
      });

      it('should handle object with optional principal field', () => {
        const schema = z.object({id: PrincipalSchema.optional(), name: z.string()});
        const principal = Principal.fromText('aaaaa-aa');
        expect(recursiveToNullable({schema, value: {id: principal, name: 'hello'}})).toEqual({
          id: [principal],
          name: 'hello'
        });
        expect(recursiveToNullable({schema, value: {id: undefined, name: 'hello'}})).toEqual({
          id: [],
          name: 'hello'
        });
      });
    });
  });

  describe('fromNullableRecursive', () => {
    describe('primitives', () => {
      it('should pass through string', () => {
        expect(recursiveFromNullable({schema: z.string(), value: 'hello'})).toBe('hello');
      });

      it('should pass through number', () => {
        expect(recursiveFromNullable({schema: z.number(), value: 42})).toBe(42);
      });

      it('should pass through bigint', () => {
        expect(recursiveFromNullable({schema: z.bigint(), value: 42n})).toBe(42n);
      });

      it('should pass through boolean', () => {
        expect(recursiveFromNullable({schema: z.boolean(), value: true})).toBe(true);
      });
    });

    describe('optional', () => {
      it('should convert [] to undefined', () => {
        expect(recursiveFromNullable({schema: z.string().optional(), value: []})).toBeUndefined();
      });

      it('should convert [value] to value', () => {
        expect(recursiveFromNullable({schema: z.string().optional(), value: ['hello']})).toBe(
          'hello'
        );
      });

      it('should convert [bigint] to bigint', () => {
        expect(recursiveFromNullable({schema: z.bigint().optional(), value: [42n]})).toBe(42n);
      });

      it('should convert [number] to number', () => {
        expect(recursiveFromNullable({schema: z.number().optional(), value: [42]})).toBe(42);
      });

      it('should convert [boolean] to boolean', () => {
        expect(recursiveFromNullable({schema: z.boolean().optional(), value: [true]})).toBe(true);
      });
    });

    describe('objects', () => {
      it('should pass through object with no optional fields', () => {
        const schema = z.object({name: z.string(), age: z.number()});
        expect(recursiveFromNullable({schema, value: {name: 'hello', age: 42}})).toEqual({
          name: 'hello',
          age: 42
        });
      });

      it('should convert [] field to undefined', () => {
        const schema = z.object({name: z.string(), age: z.number().optional()});
        expect(recursiveFromNullable({schema, value: {name: 'hello', age: []}})).toEqual({
          name: 'hello',
          age: undefined
        });
      });

      it('should convert [value] field to value', () => {
        const schema = z.object({name: z.string(), age: z.number().optional()});
        expect(recursiveFromNullable({schema, value: {name: 'hello', age: [42]}})).toEqual({
          name: 'hello',
          age: 42
        });
      });

      it('should handle multiple optional fields', () => {
        const schema = z.object({a: z.string().optional(), b: z.number().optional()});
        expect(recursiveFromNullable({schema, value: {a: ['hello'], b: []}})).toEqual({
          a: 'hello',
          b: undefined
        });
      });
    });

    describe('nested objects', () => {
      it('should recursively process nested object', () => {
        const schema = z.object({
          address: z.object({street: z.string(), city: z.string().optional()})
        });
        expect(
          recursiveFromNullable({schema, value: {address: {street: 'main', city: []}}})
        ).toEqual({address: {street: 'main', city: undefined}});
      });

      it('should handle optional nested object', () => {
        const schema = z.object({address: z.object({street: z.string()}).optional()});
        expect(recursiveFromNullable({schema, value: {address: []}})).toEqual({
          address: undefined
        });
        expect(recursiveFromNullable({schema, value: {address: [{street: 'main'}]}})).toEqual({
          address: {street: 'main'}
        });
      });
    });

    describe('arrays', () => {
      it('should pass through array of strings', () => {
        expect(recursiveFromNullable({schema: z.array(z.string()), value: ['a', 'b']})).toEqual([
          'a',
          'b'
        ]);
      });

      it('should recursively process array of objects', () => {
        const schema = z.array(z.object({name: z.string(), age: z.number().optional()}));
        expect(
          recursiveFromNullable({
            schema,
            value: [
              {name: 'hello', age: [42]},
              {name: 'world', age: []}
            ]
          })
        ).toEqual([
          {name: 'hello', age: 42},
          {name: 'world', age: undefined}
        ]);
      });
    });

    describe('principal', () => {
      it('should pass through principal', () => {
        const principal = Principal.fromText('aaaaa-aa');
        expect(recursiveFromNullable({schema: PrincipalSchema, value: principal})).toEqual(
          principal
        );
      });

      it('should convert [principal] to principal', () => {
        const principal = Principal.fromText('aaaaa-aa');
        expect(
          recursiveFromNullable({schema: PrincipalSchema.optional(), value: [principal]})
        ).toEqual(principal);
      });

      it('should convert [] to undefined for optional principal', () => {
        expect(
          recursiveFromNullable({schema: PrincipalSchema.optional(), value: []})
        ).toBeUndefined();
      });

      it('should handle object with optional principal field', () => {
        const schema = z.object({id: PrincipalSchema.optional(), name: z.string()});
        const principal = Principal.fromText('aaaaa-aa');
        expect(recursiveFromNullable({schema, value: {id: [principal], name: 'hello'}})).toEqual({
          id: principal,
          name: 'hello'
        });
        expect(recursiveFromNullable({schema, value: {id: [], name: 'hello'}})).toEqual({
          id: undefined,
          name: 'hello'
        });
      });
    });

    describe('round trip', () => {
      it('should round trip simple object', () => {
        const schema = z.object({name: z.string(), age: z.number().optional()});
        const input = {name: 'hello', age: 42};
        expect(
          recursiveFromNullable({schema, value: recursiveToNullable({schema, value: input})})
        ).toEqual(input);
      });

      it('should round trip object with undefined optional', () => {
        const schema = z.object({name: z.string(), age: z.number().optional()});
        const input = {name: 'hello', age: undefined};
        expect(
          recursiveFromNullable({schema, value: recursiveToNullable({schema, value: input})})
        ).toEqual(input);
      });

      it('should round trip nested object', () => {
        const schema = z.object({
          address: z.object({street: z.string(), city: z.string().optional()})
        });
        const input = {address: {street: 'main', city: undefined}};
        expect(
          recursiveFromNullable({schema, value: recursiveToNullable({schema, value: input})})
        ).toEqual(input);
      });

      it('should round trip array of objects', () => {
        const schema = z.array(z.object({name: z.string(), age: z.number().optional()}));
        const input = [
          {name: 'hello', age: 42},
          {name: 'world', age: undefined}
        ];
        expect(
          recursiveFromNullable({schema, value: recursiveToNullable({schema, value: input})})
        ).toEqual(input);
      });

      it('should round trip with principal', () => {
        const schema = z.object({id: PrincipalSchema.optional(), name: z.string()});
        const principal = Principal.fromText('aaaaa-aa');
        const input = {id: principal, name: 'hello'};
        expect(
          recursiveFromNullable({schema, value: recursiveToNullable({schema, value: input})})
        ).toEqual(input);
      });

      it('should round trip with undefined principal', () => {
        const schema = z.object({id: PrincipalSchema.optional(), name: z.string()});
        const input = {id: undefined, name: 'hello'};
        expect(
          recursiveFromNullable({schema, value: recursiveToNullable({schema, value: input})})
        ).toEqual(input);
      });
    });
  });
});
