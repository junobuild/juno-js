import {Principal} from '@dfinity/principal';
import {isNullish, toNullable} from '@dfinity/utils';
import type {
  ListParams as ListParamsApi,
  TimestampMatcher
} from '../../declarations/satellite/satellite.did';
import {ListError} from '../types/errors.types';
import type {ListParams, ListTimestampMatcher} from '../types/list.types';

const toListMatcherTimestamp = (matcher?: ListTimestampMatcher): [] | [TimestampMatcher] => {
  if (isNullish(matcher)) {
    return toNullable();
  }

  switch (matcher.matcher) {
    case 'equal':
      return toNullable({Equal: matcher.timestamp});
    case 'greaterThan':
      return toNullable({GreaterThan: matcher.timestamp});
    case 'lessThan':
      return toNullable({LessThan: matcher.timestamp});
    case 'between':
      return toNullable({Between: [matcher.timestamps.start, matcher.timestamps.end]});
    default:
      throw new ListError('Invalid list matcher for timestamp', matcher);
  }
};

export const toListParams = ({matcher, paginate, order, owner}: ListParams): ListParamsApi => ({
  matcher: isNullish(matcher)
    ? []
    : [
        {
          key: toNullable(matcher.key),
          description: toNullable(matcher.description),
          created_at: toListMatcherTimestamp(matcher.createdAt),
          updated_at: toListMatcherTimestamp(matcher.updatedAt)
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
