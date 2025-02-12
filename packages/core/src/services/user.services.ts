import type {Identity} from '@dfinity/agent';
import {isNullish, nonNullish} from '@dfinity/utils';
import type {Provider, User, UserData} from '../types/auth.types';
import {InitError} from '../types/errors.types';
import {getIdentity} from './auth.services';
import {getDoc, setDoc} from './doc.services';

export const initUser = async (provider?: Provider): Promise<User> => {
  const identity: Identity | undefined = getIdentity();

  if (isNullish(identity)) {
    throw new InitError('No identity to initialize the user. Have you initialized Juno?');
  }

  const userId = identity.getPrincipal().toText();

  const loadUser = (): Promise<User | undefined> =>
    getDoc<UserData>({
      collection: `#user`,
      key: userId
    });

  // TODO: uncomment
  const user = undefined; // await loadUser();

  if (isNullish(user)) {
    try {
      return await createUser({userId, provider});
    } catch (error: unknown) {

      console.log('----->', error);

      const userOnCreateError = await loadUser();

      if (nonNullish(userOnCreateError)) {
        return userOnCreateError
      }

      throw error;
    }
  }

  return user;
};

const createUser = ({
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
