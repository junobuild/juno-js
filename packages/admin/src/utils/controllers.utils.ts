import {Principal} from '@dfinity/principal';
import type {SetController} from '../../declarations/mission_control/mission_control.did';
import type {SetControllerParams} from '../types/controllers.types';
import {toNullable} from './did.utils';
import {nonNullish} from './utils';

export const mapSetControllerParams = ({
  controllerId,
  profile
}: SetControllerParams): {controllerIds: Principal[]; controller: SetController} => ({
  controllerIds: [Principal.fromText(controllerId)],
  controller: toSetController(profile)
});

const toSetController = (profile: string | null | undefined): SetController => ({
  metadata: nonNullish(profile) && profile !== '' ? [['profile', profile]] : [],
  expires_at: toNullable<bigint>(undefined)
});
