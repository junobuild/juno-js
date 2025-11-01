import {
  ActorParameters,
  AuthenticationArgs,
  AuthenticationResult,
  GetDelegationArgs,
  GetDelegationResult
} from '../types/actor';
import {getAuthActor} from './_actor.api';

export const authenticate = async ({
  actorParams,
  args
}: {
  args: AuthenticationArgs;
  actorParams: ActorParameters;
}): Promise<AuthenticationResult> => {
  const {authenticate} = await getAuthActor(actorParams);
  return await authenticate(args);
};

export const getDelegation = async ({
  actorParams,
  args
}: {
  args: GetDelegationArgs;
  actorParams: ActorParameters;
}): Promise<GetDelegationResult> => {
  const {get_delegation} = await getAuthActor(actorParams);
  return await get_delegation(args);
};
