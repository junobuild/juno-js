import {NatSchema} from '../../schemas/nat';
import {JunoSchemaId} from '../../schemas/schema-id';

describe('NatSchema', () => {
  it('should pass validation with a valid bigint', () => {
    const result = NatSchema.safeParse(200n);
    expect(result.success).toBeTruthy();
  });

  it('should fail validation with a number', () => {
    const result = NatSchema.safeParse(200);
    expect(result.success).toBeFalsy();
  });

  it('should fail validation with a string', () => {
    const result = NatSchema.safeParse('200');
    expect(result.success).toBeFalsy();
  });

  it('should fail validation with null', () => {
    const result = NatSchema.safeParse(null);
    expect(result.success).toBeFalsy();
  });

  it('should have the correct schema id', () => {
    expect(NatSchema.meta()).toEqual({id: JunoSchemaId.Nat});
  });
});
