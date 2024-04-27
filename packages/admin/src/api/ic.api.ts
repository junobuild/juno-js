import {CanisterStatus} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';
import {assertNonNullish} from '@junobuild/utils';
import type {_SERVICE as ICActor} from '../../declarations/ic/ic.did';
import type {ActorParameters} from '../types/actor.types';
import type {InstallCodeParams} from '../types/ic.types';
import {initAgent} from '../utils/actor.utils';
import {getICActor} from './actor.api';

export const upgradeCode = async ({
  actor,
  code
}: {
  actor: ActorParameters;
  code: InstallCodeParams;
}): Promise<void> => {
  const {install_code}: ICActor = await getICActor(actor);

  return install_code({
    ...code,
    sender_canister_version: []
  });
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
