import {Principal} from '@icp-sdk/core/principal';
import {caller} from '../../ic-cdk/caller.ic-cdk';

vi.stubGlobal('__ic_cdk_caller', vi.fn());

describe('ic-cdk > caller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a valid Principal', () => {
    const mockPrincipalBytes = Principal.anonymous().toUint8Array();
    vi.mocked(global.__ic_cdk_caller).mockReturnValue(mockPrincipalBytes);

    const result = caller();

    expect(result).toBeInstanceOf(Principal);
    expect(result.toUint8Array()).toEqual(mockPrincipalBytes);
  });
});
