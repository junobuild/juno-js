import {CoseEncodedKey, CosePublicKey} from '../../../webauthn/agent-js/cose-key';
import {_coseToDerEncodedBlob} from '../../../webauthn/agent-js/cose-utils';

describe('CosePublicKey', () => {
  const cases: CoseEncodedKey[] = [
    new Uint8Array([]),
    new Uint8Array([0]),
    new Uint8Array([1, 2, 3, 4, 5]),
    new Uint8Array(Array.from({length: 64}, (_, i) => (i * 9 + 17) & 0xff))
  ];

  it.each(cases.map((c, i) => [i, c]))(
    'toDer/toRaw match ground truth for fixture #%d',
    (_idx, cose: CoseEncodedKey) => {
      const expectedDer = _coseToDerEncodedBlob(cose);

      const key = new CosePublicKey(cose);

      expect(key.toDer()).toEqual(expectedDer);

      const raw = key.toRaw();
      expect(raw).toEqual(new Uint8Array(expectedDer));
    }
  );

  it('is structurally compatible with PublicKey and PublicKeyWithToRaw (type-level)', () => {
    const key = new CosePublicKey(new Uint8Array([1, 2, 3]));

    expect(typeof key.toDer).toBe('function');
    expect(typeof key.toRaw).toBe('function');
  });
});
