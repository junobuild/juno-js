import type {_SERVICE as IndexActor} from '../../declarations/index/index.did';
import {
  type GetAccountIdentifierTransactionsArgs,
  type Result
} from '../../declarations/index/index.did';
import type {IndexParameters} from '../types/actor.types';
import {getIndexActor} from './actor.api';

export const balance = async ({
  index: actorParams,
  accountIdentifier
}: {
  index: IndexParameters;
  accountIdentifier: string;
}): Promise<bigint> => {
  const actor: IndexActor = await getIndexActor(actorParams);
  return actor.get_account_identifier_balance(accountIdentifier);
};

export const transactions = async ({
  args,
  index: actorParams
}: {
  args: GetAccountIdentifierTransactionsArgs;
  index: IndexParameters;
}): Promise<Result> => {
  const actor: IndexActor = await getIndexActor(actorParams);
  return actor.get_account_identifier_transactions(args);
};
