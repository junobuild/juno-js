import type {Ed25519KeyIdentity} from '@dfinity/identity';
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
} as unknown as Ed25519KeyIdentity;
