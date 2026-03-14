import * as z from 'zod';
import {schemaFromIdl, schemaToIdl} from '../../utils/idl';

describe('idl', () => {
  const StatusSchema = z.discriminatedUnion('type', [
    z.object({type: z.literal('active'), owner: z.string()}),
    z.object({type: z.literal('inactive')}),
    z.object({type: z.literal('pending'), assignee: z.string()})
  ]);

  describe('schemaToIdl', () => {
    describe('discriminatedUnion', () => {
      it('converts active variant', () => {
        expect(schemaToIdl({schema: StatusSchema, value: {type: 'active', owner: 'abc'}})).toEqual({
          active: {owner: 'abc'}
        });
      });

      it('converts unit variant', () => {
        expect(schemaToIdl({schema: StatusSchema, value: {type: 'inactive'}})).toEqual({
          inactive: {}
        });
      });

      it('converts pending variant', () => {
        expect(
          schemaToIdl({schema: StatusSchema, value: {type: 'pending', assignee: 'xyz'}})
        ).toEqual({
          pending: {assignee: 'xyz'}
        });
      });

      it('throws if discriminator is missing', () => {
        expect(() => schemaToIdl({schema: StatusSchema, value: {owner: 'abc'}})).toThrow();
      });
    });

    describe('optional', () => {
      it('converts undefined to []', () => {
        expect(schemaToIdl({schema: z.string().optional(), value: undefined})).toEqual([]);
      });

      it('wraps present value in array', () => {
        expect(schemaToIdl({schema: z.string().optional(), value: 'hello'})).toEqual(['hello']);
      });
    });

    describe('object with discriminatedUnion field', () => {
      const Schema = z.object({username: z.string(), status: StatusSchema});

      it('converts nested discriminated union', () => {
        expect(
          schemaToIdl({
            schema: Schema,
            value: {username: 'David', status: {type: 'active', owner: 'abc'}}
          })
        ).toEqual({
          username: 'David',
          status: {active: {owner: 'abc'}}
        });
      });
    });

    describe('object with optional discriminatedUnion field', () => {
      const Schema = z.object({status: StatusSchema.optional()});

      it('converts optional discriminated union', () => {
        expect(
          schemaToIdl({schema: Schema, value: {status: {type: 'active', owner: 'abc'}}})
        ).toEqual({
          status: [{active: {owner: 'abc'}}]
        });
      });

      it('converts absent optional discriminated union', () => {
        expect(schemaToIdl({schema: Schema, value: {status: undefined}})).toEqual({
          status: []
        });
      });
    });
  });

  describe('schemaFromIdl', () => {
    describe('discriminatedUnion', () => {
      it('converts active variant', () => {
        expect(schemaFromIdl({schema: StatusSchema, value: {active: {owner: 'abc'}}})).toEqual({
          type: 'active',
          owner: 'abc'
        });
      });

      it('converts unit variant', () => {
        expect(schemaFromIdl({schema: StatusSchema, value: {inactive: {}}})).toEqual({
          type: 'inactive'
        });
      });

      it('converts pending variant', () => {
        expect(schemaFromIdl({schema: StatusSchema, value: {pending: {assignee: 'xyz'}}})).toEqual({
          type: 'pending',
          assignee: 'xyz'
        });
      });

      it('throws if more than one key', () => {
        expect(() =>
          schemaFromIdl({schema: StatusSchema, value: {active: {}, inactive: {}}})
        ).toThrow();
      });

      it('throws if inner is not an object', () => {
        expect(() =>
          schemaFromIdl({schema: StatusSchema, value: {active: 'not-an-object'}})
        ).toThrow();
      });
    });

    describe('optional', () => {
      it('converts [] to undefined', () => {
        expect(schemaFromIdl({schema: z.string().optional(), value: []})).toBeUndefined();
      });

      it('unwraps present value', () => {
        expect(schemaFromIdl({schema: z.string().optional(), value: ['hello']})).toBe('hello');
      });
    });

    describe('object with discriminatedUnion field', () => {
      const Schema = z.object({username: z.string(), status: StatusSchema});

      it('converts nested discriminated union', () => {
        expect(
          schemaFromIdl({
            schema: Schema,
            value: {username: 'David', status: {active: {owner: 'abc'}}}
          })
        ).toEqual({
          username: 'David',
          status: {type: 'active', owner: 'abc'}
        });
      });
    });
  });
});
