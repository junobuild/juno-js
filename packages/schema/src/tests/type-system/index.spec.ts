import {Principal} from '@icp-sdk/core/principal';
import {j} from '../../type-system';

describe('j', () => {
  const mockUserIdText = 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe';
  const mockUserIdPrincipal = Principal.fromText(mockUserIdText);

  it('should expose zod methods', () => {
    expect(j.string).toBeDefined();
    expect(j.number).toBeDefined();
    expect(j.object).toBeDefined();
    expect(j.strictObject).toBeDefined();
  });

  it('should not expose union', () => {
    expect((j as any).union).toBeUndefined();
  });

  it('should expose Principal', () => {
    expect(j.principal).toBeDefined();
    const schema = j.principal();
    expect(schema).toBeDefined();
  });

  it('should expose Uint8Array', () => {
    expect(j.uint8Array).toBeDefined();
    const schema = j.uint8Array();
    expect(schema).toBeDefined();
  });

  it('should parse a strictObject with principal', () => {
    const schema = j.strictObject({id: j.principal()});
    const result = schema.safeParse({id: mockUserIdPrincipal});
    expect(result.success).toBe(true);

    const resultInvalid = schema.safeParse({id: mockUserIdText});
    expect(resultInvalid.success).toBe(false);
  });
});
