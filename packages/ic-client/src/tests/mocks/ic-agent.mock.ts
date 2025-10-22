import type {HttpAgent, Identity} from '@icp-sdk/core/agent';
import {mockUserIdPrincipal} from './modules.mock';

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

export const mockHttpAgent = {
  call: vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => ({data: 'mocked call result'})
  }),
  query: vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => ({data: 'mocked query result'})
  }),
  fetchRootKey: vi.fn().mockResolvedValue(undefined)
} as unknown as HttpAgent;
