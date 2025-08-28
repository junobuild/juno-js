import {Principal} from '@dfinity/principal';
import {ListParams} from '../../../core/types/list';
import {toListParams} from '../../../core/utils/list.utils';

describe('list.utils', () => {
  it('handles full ListParams input', () => {
    const params: ListParams = {
      matcher: {
        key: 'myKey',
        description: 'desc',
        createdAt: {matcher: 'equal', timestamp: BigInt(123)},
        updatedAt: {matcher: 'greaterThan', timestamp: BigInt(456)}
      },
      paginate: {startAfter: 'itemId', limit: 10},
      order: {desc: true, field: 'created_at'},
      owner: Principal.anonymous().toText()
    };

    const result = toListParams(params);

    expect(result).toEqual({
      matcher: [
        {
          key: ['myKey'],
          description: ['desc'],
          created_at: [{Equal: BigInt(123)}],
          updated_at: [{GreaterThan: BigInt(456)}]
        }
      ],
      paginate: [
        {
          start_after: ['itemId'],
          limit: [BigInt(10)]
        }
      ],
      order: [
        {
          desc: true,
          field: {CreatedAt: null}
        }
      ],
      owner: [Principal.anonymous()]
    });
  });

  it('handles nullish values gracefully', () => {
    const result = toListParams({});

    expect(result).toEqual({
      matcher: [],
      paginate: [],
      order: [],
      owner: []
    });
  });
});
