import {Principal} from '@dfinity/principal';
import {nonNullish, toNullable} from '@dfinity/utils';
import type {MissionControlDid} from '@junobuild/ic-client';
import type {SetControllerParams} from '../types/controllers';

export const mapSetControllerParams = ({
  controllerId,
  profile
}: SetControllerParams): {
  controllerIds: Principal[];
  controller: MissionControlDid.SetController;
} => ({
  controllerIds: [Principal.fromText(controllerId)],
  controller: toSetController(profile)
});

const toSetController = (profile: string | null | undefined): MissionControlDid.SetController => ({
  metadata: nonNullish(profile) && profile !== '' ? [['profile', profile]] : [],
  expires_at: toNullable<bigint>(undefined),
  scope: {Admin: null}
});
