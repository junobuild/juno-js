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

// eslint-disable-next-line local-rules/use-option-type-wrapper
const toSetController = (profile: string | null | undefined): SetController => ({
  metadata: nonNullish(profile) && profile !== '' ? [['profile', profile]] : [],
  expires_at: toNullable<bigint>(undefined),
  scope: {Admin: null}
});
