import {Principal} from '@dfinity/principal';
import {describe, expect, it} from 'vitest';
import {toPrincipal} from './principal.utils';

describe('toPrincipal', () => {
  const principalText = 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe';
  const principalObj = Principal.fromText(principalText);

  it('should return the same Principal if given a Principal', () => {
    const result = toPrincipal(principalObj);
    expect(result).toBe(principalObj);
  });

  it('should convert a string to a Principal', () => {
    const result = toPrincipal(principalText);
    expect(result).toEqual(principalObj);
  });

  it('should throw if given an invalid string', () => {
    expect(() => toPrincipal('not-a-principal')).toThrow();
  });
});
