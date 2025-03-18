import {IDL} from '@dfinity/candid';
import {describe, expect} from 'vitest';
import {
  CallArgSchema,
  CallArgsSchema,
  CallParamsSchema,
  CallResultSchema,
  IDLTypeSchema
} from '../../../ic-cdk/schemas/call';
import {mockCanisterId} from '../../mocks/ic-cdk.mocks';

describe('ic-cdk > schemas > call', () => {
  describe('IDLTypeSchema', () => {
    it('should validate IDL.Type instance', () => {
      const idlType = IDL.Text;
      expect(() => IDLTypeSchema.parse(idlType)).not.toThrow();
    });

    it('should reject non-IDL.Type instance', () => {
      expect(() => IDLTypeSchema.parse({})).toThrow();
    });
  });

  describe('CallArgSchema', () => {
    it('should validate a tuple of IDL.Type and value', () => {
      const validArg = [IDL.Text, 'Hello'];
      expect(() => CallArgSchema.parse(validArg)).not.toThrow();
    });

    it('should reject invalid tuple structure', () => {
      expect(() => CallArgSchema.parse(['Hello', IDL.Text])).toThrow();
    });
  });

  describe('CallArgsSchema', () => {
    it('should validate an array of valid CallArg tuples', () => {
      const validArgs = [
        [IDL.Text, 'Hello'],
        [IDL.Nat, 42]
      ];
      expect(() => CallArgsSchema.parse(validArgs)).not.toThrow();
    });

    it('should reject invalid CallArgs', () => {
      expect(() => CallArgsSchema.parse([['Hello', IDL.Text]])).toThrow();
    });
  });

  describe('CallResultSchema', () => {
    it('should validate a result of IDL.Types', () => {
      const validResult = IDL.Text;
      expect(() => CallResultSchema.parse(validResult)).not.toThrow();
    });

    it('should reject a non-IDL.Type element', () => {
      expect(() => CallResultSchema.parse({})).toThrow();
    });
  });

  describe('CallParamsSchema', () => {
    const validParams = {
      canisterId: mockCanisterId,
      method: 'greet',
      args: [[IDL.Text, 'Hello']],
      result: IDL.Text
    };

    it('should validate a correct CallParams object', () => {
      expect(() => CallParamsSchema.parse(validParams)).not.toThrow();
    });

    it('should validate a correct CallParams object with args undefined', () => {
      expect(() => CallParamsSchema.parse({...validParams, args: undefined})).not.toThrow();
    });

    it('should validate a correct CallParams object without args', () => {
      const {args: _, ...rest} = validParams;
      expect(() => CallParamsSchema.parse(rest)).not.toThrow();
    });

    it('should validate a correct CallParams object with canister id as Uint8Array', () => {
      const validCanisterIdParams = {
        ...validParams,
        canisterId: mockCanisterId.toUint8Array()
      };

      expect(() => CallParamsSchema.parse(validCanisterIdParams)).not.toThrow();
    });

    it('should reject incorrect CallParams structure with an invalid canisterId', () => {
      const invalidParams = {
        ...validParams,
        canisterId: 'jx5yt-yyaaa-aaaal-abzbq-cai'
      };
      expect(() => CallParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject incorrect CallParams structure with an empty method name', () => {
      const invalidParams = {
        ...validParams,
        canisterId: mockCanisterId,
        method: ''
      };
      expect(() => CallParamsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject incorrect CallParams structure with an invalid args array', () => {
      const invalidParams = {
        ...validParams,
        args: [['Hello', IDL.Text]]
      };
      expect(() => CallParamsSchema.parse(invalidParams)).toThrow();
    });
  });
});
