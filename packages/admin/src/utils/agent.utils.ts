import {HttpAgent} from '@dfinity/agent';
import {ActorParameters} from '../types/actor';

// We have this in a utils because we want to mock it for test purposes.
// Not really happy with that, I welcome better ideas!
export const createAgent = async ({
  identity,
  host,
  localActor
}: Pick<ActorParameters, 'identity'> & {host: string; localActor: boolean}) => {
  return await HttpAgent.create({
    identity,
    host,
    retryTimes: 10,
    shouldFetchRootKey: localActor
  });
};
