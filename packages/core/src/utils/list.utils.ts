import {Principal} from '@dfinity/principal';
import {isNullish, toNullable} from '@junobuild/utils';
import type {ListParams as ListParamsApi} from '../../declarations/satellite/satellite.did';
import type {ListParams} from '../types/list.types';

export const toListParams = ({matcher, paginate, order, owner}: ListParams): ListParamsApi => ({
  matcher: isNullish(matcher)
    ? []
    : [
        {
          key: toNullable(matcher.key),
          description: toNullable(matcher.description)
        }
      ],
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
  owner: toNullable(
    isNullish(owner) ? undefined : typeof owner === 'string' ? Principal.fromText(owner) : owner
  )
});
