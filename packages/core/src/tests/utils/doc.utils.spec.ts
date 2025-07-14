import {Principal} from '@dfinity/principal';
import {toArray} from '@junobuild/utils';
import {Doc as DocDid} from '../../../declarations/satellite/satellite.did';
import {Doc} from '../../types/doc';
import {fromDoc, toDelDoc, toSetDoc} from '../../utils/doc.utils';
import {mockUserIdPrincipal, mockUserIdText} from '../mocks/mocks';

describe('doc.utils', () => {
  it('toSetDoc encodes values using toArray', async () => {
    const input = {
      key: 'test-key',
      owner: Principal.anonymous().toText(),
      data: {value: BigInt(123), owner: Principal.anonymous()},
      description: 'Test',
      version: BigInt(1),
      created_at: BigInt(1),
      updated_at: BigInt(2)
    };

    const result = await toSetDoc(input);

    expect(result.description).toEqual(['Test']);
    expect(result.version).toEqual([BigInt(1)]);
    expect(result.data).instanceOf(Uint8Array);

    expect(result.data.length).toBeGreaterThan(0);
  });

  it('fromDoc decodes values using fromArray', async () => {
    type TestData = {value: bigint; owner: Principal};

    const data: TestData = {
      value: BigInt(123),
      owner: mockUserIdPrincipal
    };

    const encoded = await toArray(data);

    const docApi: DocDid = {
      owner: Principal.anonymous(),
      data: encoded,
      description: ['Description'],
      version: [BigInt(1)],
      created_at: BigInt(1),
      updated_at: BigInt(2)
    };

    const result: Doc<TestData> = await fromDoc({doc: docApi, key: 'test-key'});

    expect(result.owner).toBe(Principal.anonymous().toText());
    expect(result.description).toBe('Description');
    expect(result.version).toEqual(BigInt(1));

    expect(result.data.value).toBe(BigInt(123));
    expect(result.data.owner.toText()).toBe(mockUserIdText);
  });

  it('toDelDoc returns correct structure', () => {
    const input = {
      key: 'key',
      owner: Principal.anonymous().toText(),
      data: {something: 1},
      description: undefined,
      version: BigInt(2),
      created_at: BigInt(1),
      updated_at: BigInt(2)
    };

    const result = toDelDoc(input);

    expect(result).toEqual({
      version: [BigInt(2)]
    });
  });
});
