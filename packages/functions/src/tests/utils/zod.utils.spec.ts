import {QuerySchema} from '../../functions/query';
import {defineHook, type OnSetDoc} from '../../hooks/hooks';

describe('zod.utils', () => {
  it('should not throw', () => {
    const onSetDoc = defineHook<OnSetDoc>({
      collections: [],
      run: async (_context) => {}
    });

    // Error: implement() must be called with a function
    expect(QuerySchema.safeParse(onSetDoc)).not.toThrowError();
  });
});
