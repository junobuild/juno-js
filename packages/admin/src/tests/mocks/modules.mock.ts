import type {Principal} from '@dfinity/principal';
import type {OrbiterDid} from '@junobuild/ic-client';
import {mockUserIdPrincipal} from './admin.mock';

export const mockController: OrbiterDid.Controller = {
  metadata: [['key', 'value']],
  scope: {Admin: null},
  created_at: 1624532700000n,
  updated_at: 1624532800000n,
  expires_at: [1624532900000n]
};

export const mockControllers: [Principal, OrbiterDid.Controller][] = [
  [mockUserIdPrincipal, mockController]
];
