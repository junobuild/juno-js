import type {HttpAgent, Identity} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';

export const mockUserIdText = 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe';
export const mockUserIdPrincipal = Principal.fromText(mockUserIdText);

export const mockSatelliteId = 'jx5yt-yyaaa-aaaal-abzbq-cai';
export const mockSatelliteIdPrincipal = Principal.fromText(mockSatelliteId);

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
