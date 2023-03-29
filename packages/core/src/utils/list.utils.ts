import type {ListParams as ListParamsApi} from '../../declarations/satellite/satellite.did';
import type {ListParams} from '../types/list.types';
import {toNullable} from './did.utils';
import {isNullish} from './utils';

export const toListParams = ({matcher, paginate, order}: ListParams): ListParamsApi => ({
  matcher: toNullable(matcher),
  paginate: toNullable(
    isNullish(paginate)
      ? undefined
      : {
          start_after: toNullable(paginate.startAfter),
          limit: toNullable(isNullish(paginate.limit) ? undefined : BigInt(paginate.limit))
        }
  ),
  order: toNullable(
    isNullish(order)
      ? undefined
      : {
          desc: order.desc,
          field:
            order.field === 'created_at'
              ? {CreatedAt: null}
              : order.field === 'updated_at'
              ? {UpdatedAt: null}
              : {Keys: null}
        }
  ),
  owner: []
});
