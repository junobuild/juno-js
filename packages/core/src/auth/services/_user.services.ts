import {isNullish, nonNullish} from '@dfinity/utils';
import {isSatelliteError, JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE} from '@junobuild/errors';
import {getDoc, setDoc} from '../../datastore/services/doc.services';
import {InitError} from '../types/errors';
import type {Provider} from '../types/provider';
import type {User, UserData} from '../types/user';
import {getIdentity} from './auth.services';

type UserId = string;

export const initUser = async (provider?: Provider): Promise<User> => {
  const {user, userId} = await loadUser();

  // For returning users we do not need to create a user entry.
  // Sign-in, sign-out, and sign-in again.
  if (nonNullish(user)) {
    return user;
  }

  try {
    return await createUser({userId, provider});
  } catch (error: unknown) {
    // When a user signs in for the first time and get user returns `undefined`,
    // a new user entry is created. If the browser is reloaded and get user
    // still returns `undefined`, another try is made to create user entry, which is not
    // allowed since only the controller can update users, assuming the entry has been
    // created in the meantime. To prevent errors, we reload the user data,
    // as the issue indicates the user entity exists.
    if (isSatelliteError({error, type: JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE})) {
      const userOnCreateError = await getUser({userId});

      if (nonNullish(userOnCreateError)) {
        return userOnCreateError;
      }
    }

    throw error;
  }
};

export const loadUser = async (): Promise<{userId: UserId; user: User | undefined}> => {
  const identity = getIdentity();

  if (isNullish(identity)) {
    throw new InitError('No identity to initialize the user. Have you initialized Juno?');
  }

  const userId = identity.getPrincipal().toText();

  const user = await getUser({userId});

  return {
    userId,
    user
  };
};

const getUser = ({userId}: {userId: UserId}): Promise<User | undefined> =>
  getDoc<UserData>({
    collection: `#user`,
    key: userId
  });

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
