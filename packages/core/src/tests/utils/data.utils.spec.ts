import {toArray} from '@junobuild/utils';
import {mapData} from '../../utils/data.utils';
import {mockUserIdPrincipal, mockUserIdText} from '../mocks/mocks';

describe('data.utils', () => {
  it('returns parsed value on valid data', async () => {
    const originalData = {value: BigInt(123), owner: mockUserIdPrincipal, something: 'hello'};
    const encoded = await toArray(originalData);

    const result = await mapData<typeof originalData>({data: encoded});

    expect(result.something).toEqual('hello');
    expect(result.value).toEqual(BigInt(123));
    expect(result.owner.toText()).toEqual(mockUserIdText);
  });

  it('returns undefined if fromArray throws', async () => {
    // Pass invalid Uint8Array that triggers JSON.parse error
    const invalidData = new Uint8Array([255, 255, 255]);

    const originalError = console.error;
    console.error = vi.fn();

    const result = await mapData({data: invalidData});

    expect(result).toBeUndefined();

    console.error = originalError;
  });
});
