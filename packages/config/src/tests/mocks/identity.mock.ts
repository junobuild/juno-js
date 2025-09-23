import type {Identity} from '@dfinity/agent';
import {mockUserIdPrincipal} from './principal.mock';

const transformRequest = () => {
  console.error(
    'It looks like the agent is trying to make a request that should have been mocked at',
    new Error().stack
  );
  throw new Error('Not implemented');
};

export const mockIdentity = {
  getPrincipal: () => mockUserIdPrincipal,
  transformRequest
} as unknown as Identity;
