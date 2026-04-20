import {Principal} from '@icp-sdk/core/principal';
import {canisterSelf, id, satelliteSelf} from '../../ic-cdk/id.ic-cdk';

vi.stubGlobal('__ic_cdk_id', vi.fn());

describe('ic-cdk > id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a valid Principal', () => {
    const mockPrincipalBytes = Principal.anonymous().toUint8Array();
    vi.mocked(global.__ic_cdk_id).mockReturnValue(mockPrincipalBytes);

    const result = canisterSelf();

    expect(result).toBeInstanceOf(Principal);
    expect(result.toUint8Array()).toEqual(mockPrincipalBytes);
  });

  it('id should be an alias for canisterSelf', () => {
    const mockPrincipalBytes = Principal.anonymous().toUint8Array();
    vi.mocked(global.__ic_cdk_id).mockReturnValue(mockPrincipalBytes);

    expect(id()).toEqual(canisterSelf());
  });

  it('satelliteSelf should be an alias for canisterSelf', () => {
    const mockPrincipalBytes = Principal.anonymous().toUint8Array();
    vi.mocked(global.__ic_cdk_id).mockReturnValue(mockPrincipalBytes);

    expect(satelliteSelf()).toEqual(canisterSelf());
  });
});
