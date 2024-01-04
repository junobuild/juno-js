import type {Identity} from '@dfinity/agent';

export interface ActorParameters {
  identity: Identity;
  fetch?: typeof fetch;
  container?: boolean | 'string';
}

export interface IndexParameters extends ActorParameters {
  indexId?: string;
}
