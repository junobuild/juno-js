import {CanisterStatus} from '@dfinity/agent';
import {ICManagementCanister, InstallCodeParams} from '@dfinity/ic-management';
import {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@junobuild/utils';
import type {ActorParameters} from '../types/actor.types';
import {initAgent} from '../utils/actor.utils';

export const upgradeCode = async ({
  actor,
  code
}: {
  actor: ActorParameters;
  code: InstallCodeParams;
}): Promise<void> => {
  const agent = await initAgent(actor);

  const {installCode} = ICManagementCanister.create({
    agent
  });

  return installCode(code);
};

export const canisterMetadata = async ({
  canisterId,
  path,
  ...rest
}: ActorParameters & {
  canisterId: string | undefined;
  path: string;
}): Promise<CanisterStatus.Status | undefined> => {
  assertNonNullish(canisterId, 'A canister ID must be provided to request its status.');

  const agent = await initAgent(rest);

  const result = await CanisterStatus.request({
    canisterId: Principal.from(canisterId),
    agent,
    paths: [
      {
        kind: 'metadata',
        key: path,
        path,
        decodeStrategy: 'utf-8'
      }
    ]
  });

  return result.get(path);
};
