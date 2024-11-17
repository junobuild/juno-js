import {Principal} from '@dfinity/principal';
import {nonNullish, toNullable} from '@junobuild/utils';
import type {SetController} from '../../declarations/mission_control/mission_control.did';
import type {SetControllerParams} from '../types/controllers.types';

export const mapSetControllerParams = ({
  controllerId,
  profile
}: SetControllerParams): {controllerIds: Principal[]; controller: SetController} => ({
  controllerIds: [Principal.fromText(controllerId)],
  controller: toSetController(profile)
});

const toSetController = (profile: Option<string>): SetController => ({
  metadata: nonNullish(profile) && profile !== '' ? [['profile', profile]] : [],
  expires_at: toNullable<bigint>(undefined),
  scope: {Admin: null}
});
