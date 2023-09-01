import type {Identity} from '@dfinity/agent';
import {isNullish} from '@junobuild/utils';
import type {Provider, User, UserData} from '../types/auth.types';
import {getIdentity} from './auth.services';
import {getDoc, setDoc} from './doc.services';

export const initUser = async (provider?: Provider): Promise<User> => {
  const identity: Identity | undefined = getIdentity();

  if (isNullish(identity)) {
    throw new Error('No identity to initialize the user. Have you initialized Juno?');
  }

  const userId = identity.getPrincipal().toText();

  const user: User | undefined = await getDoc<UserData>({
    collection: `#user`,
    key: userId
  });

  if (isNullish(user)) {
    const newUser: User = await createUser({userId, provider});
    return newUser;
  }

  return user;
};

const createUser = async ({
  userId,
  ...rest
}: {
  userId: string;
} & UserData): Promise<User> =>
  setDoc<UserData>({
    collection: `#user`,
    doc: {
      key: userId,
      data: rest
    }
  });
