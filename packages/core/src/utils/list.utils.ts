import type {ListParams} from '../types/list.types';
import {toNullable} from './did.utils';
import {isNullish} from './utils';

export const toListParams = ({matcher, paginate, order}: ListParams) => ({
  matcher: toNullable(matcher),
  paginate: toNullable(
    isNullish(paginate)
      ? undefined
      : {
          start_after: toNullable(paginate.startAfter),
          limit: toNullable(isNullish(paginate.limit) ? undefined : BigInt(paginate.limit))
        }
  ),
  order: toNullable(order)
});
