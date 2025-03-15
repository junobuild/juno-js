import {Principal} from '@dfinity/principal';
import {id} from '../../ic-cdk/id';

vi.stubGlobal('__ic_cdk_id', vi.fn());

describe('id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a valid Principal', () => {
    const mockPrincipalBytes = Principal.anonymous().toUint8Array();
    vi.mocked(global.__ic_cdk_id).mockReturnValue(mockPrincipalBytes);

    const result = id();

    expect(result).toBeInstanceOf(Principal);
    expect(result.toUint8Array()).toEqual(mockPrincipalBytes);
  });
});
