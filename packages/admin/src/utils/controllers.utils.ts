import {nonNullish, toNullable} from '@junobuild/utils';
import {Principal} from '@icp-sdk/core/principal';
import type {MissionControlDid} from '@junobuild/ic-client/actor';
import type {SetControllerParams} from '../types/controllers';

export const mapSetControllerParams = ({
  controllerId,
  profile
}: SetControllerParams): {
  controllerIds: Principal[];
  controller: MissionControlDid.SetAccessKey;
} => ({
  controllerIds: [Principal.fromText(controllerId)],
  controller: toSetController(profile)
});

const toSetController = (profile: string | null | undefined): MissionControlDid.SetAccessKey => ({
  metadata: nonNullish(profile) && profile !== '' ? [['profile', profile]] : [],
  expires_at: toNullable<bigint>(undefined),
  scope: {Admin: null},
  kind: toNullable()
});
