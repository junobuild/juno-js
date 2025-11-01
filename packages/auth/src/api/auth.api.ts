import {
  AuthenticationArgs,
  AuthenticationResult,
  AuthParameters,
  GetDelegationArgs,
  GetDelegationResult
} from '../types/actor';
import {getAuthActor} from './_actor.api';

export const authenticate = async ({
  auth,
  args
}: {
  args: AuthenticationArgs;
  auth: AuthParameters;
}): Promise<AuthenticationResult> => {
  const {authenticate} = await getAuthActor(auth);
  return await authenticate(args);
};

export const getDelegation = async ({
  auth,
  args
}: {
  args: GetDelegationArgs;
  auth: AuthParameters;
}): Promise<GetDelegationResult> => {
  const {get_delegation} = await getAuthActor(auth);
  return await get_delegation(args);
};
