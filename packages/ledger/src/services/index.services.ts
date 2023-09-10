import {toNullable} from '@dfinity/utils';
import {type GetAccountIdentifierTransactionsResponse} from '../../declarations/index/index.did';
import {balance as balanceApi, transactions as transactionsApi} from '../api/index.api';
import type {IndexParameters} from '../types/actor.types';
import type {TransactionsArgs} from '../types/index.types';

export const balance = (params: {
  index: IndexParameters;
  accountIdentifier: string;
}): Promise<bigint> => balanceApi(params);

export const transactions = async ({
  args: {start, ...argsRest},
  ...rest
}: {
  args: TransactionsArgs;
  index: IndexParameters;
}): Promise<GetAccountIdentifierTransactionsResponse> => {
  const result = await transactionsApi({
    ...rest,
    args: {
      ...argsRest,
      start: toNullable(start)
    }
  });

  if ('Err' in result) {
    throw new Error(result.Err.message);
  }

  const {Ok} = result;
  return Ok;
};
