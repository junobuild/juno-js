import type {Identity} from '@dfinity/agent';
import {isNullish, nonNullish} from '@dfinity/utils';
import {isSatelliteError, JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE} from '@junobuild/errors/src';
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

      // When a user signs in for the first time and get user returns `undefined`,
      // a new user entry is created. If the browser is reloaded and get user
      // still returns `undefined`, another try is made to create user entry, which is not
      // allowed since only the controller can update users, assuming the entry has been
      // created in the meantime. To prevent errors, we reload the user data,
      // as the issue indicates the user entity exists.
      if (isSatelliteError({error, type: JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE})) {
        const userOnCreateError = await loadUser();

        if (nonNullish(userOnCreateError)) {
          return userOnCreateError;
        }
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
