import type {GetAccountIdentifierTransactionsArgs} from '../../declarations/index/index.did';

export type TransactionsArgs = Omit<GetAccountIdentifierTransactionsArgs, 'start'> & {
  start?: bigint;
};
