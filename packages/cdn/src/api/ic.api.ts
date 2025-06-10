import {
  type take_canister_snapshot_result
,
  type list_canister_snapshots_result,
  type snapshot_id,
  ICManagementCanister
} from '@dfinity/ic-management';
import {Principal} from '@dfinity/principal';
import type {ActorParameters, CdnParameters} from '../types/actor.params';
import {useOrInitAgent} from '../utils/actor.utils';

const listCanisterSnapshots = async ({
  actor,
  canisterId
}: {
  actor: ActorParameters;
  canisterId: Principal;
}): Promise<list_canister_snapshots_result> => {
  const agent = await useOrInitAgent(actor);

  const {listCanisterSnapshots} = ICManagementCanister.create({
    agent
  });

  return listCanisterSnapshots({canisterId});
};

const takeCanisterSnapshot = async ({
  actor,
  ...rest
}: {
  actor: ActorParameters;
  canisterId: Principal;
  snapshotId?: snapshot_id;
}): Promise<take_canister_snapshot_result> => {
  const agent = await useOrInitAgent(actor);

  const {takeCanisterSnapshot} = ICManagementCanister.create({
    agent
  });

  return takeCanisterSnapshot(rest);
};

export const createSnapshot = async ({cdn}: {cdn: CdnParameters}) => {
  const mapParams = (): {actor: ActorParameters; canisterId: Principal} => {
    if ('satellite' in cdn) {
      const {
        satellite: {satelliteId, ...rest}
      } = cdn;
      return {
        canisterId:
          satelliteId instanceof Principal ? satelliteId : Principal.fromText(satelliteId),
        actor: rest
      };
    }

    const {
      console: {consoleId, ...rest}
    } = cdn;
    return {
      canisterId: consoleId instanceof Principal ? consoleId : Principal.fromText(consoleId),
      actor: rest
    };
  };

  const params = mapParams();

  const snapshots = await listCanisterSnapshots(params);

  // TODO: currently only one snapshot per canister is supported on the IC
  await takeCanisterSnapshot({
    ...params,
    snapshotId: snapshots?.[0]?.id
  });
};
