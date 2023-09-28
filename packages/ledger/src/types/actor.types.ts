import type {Identity} from '@dfinity/agent';

export interface ActorParameters {
  identity: Identity;
  fetch?: typeof fetch;
  env?: 'dev' | 'prod';
}

export interface IndexParameters extends ActorParameters {
  indexId?: string;
}
