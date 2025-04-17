import {nowInBigIntNanoSeconds} from '@dfinity/utils';
import {time} from '../../ic-cdk/time.ic-cdk';

vi.stubGlobal('__ic_cdk_time', vi.fn());

describe('ic-cdk > time', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a timestamp', () => {
    const now = nowInBigIntNanoSeconds();

    vi.mocked(global.__ic_cdk_time).mockReturnValue(now);

    const result = time();

    expect(result).toBeTypeOf('bigint');
    expect(result).toEqual(now);
  });
});
