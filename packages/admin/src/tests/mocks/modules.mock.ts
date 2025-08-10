import type {Principal} from '@dfinity/principal';
import type {Controller} from '@junobuild/ic-client/dist/declarations/orbiter/orbiter.did';
import {mockUserIdPrincipal} from './admin.mock';

export const mockController: Controller = {
  metadata: [['key', 'value']],
  scope: {Admin: null},
  created_at: 1624532700000n,
  updated_at: 1624532800000n,
  expires_at: [1624532900000n]
};

export const mockControllers: [Principal, Controller][] = [[mockUserIdPrincipal, mockController]];
