import {isNullish, nonNullish} from '@dfinity/utils';
import {isSatelliteError, JUNO_DATASTORE_ERROR_USER_CANNOT_UPDATE} from '@junobuild/errors';
import {getDoc, setDoc} from '../../datastore/services/doc.services';
import {InitError} from '../types/errors';
import type {Provider} from '../types/provider';
import type {User, UserData} from '../types/user';
import {getIdentity} from './auth.services';

type UserId = string;

export const initUser = async ({provider}: {provider: Provider}): Promise<User> => {
  const {user, userId} = await loadUser();

  // For returning users we do not need to create a user entry.
  // Sign-in, sign-out, and sign-in again.
  if (nonNullish(user)) {
    return user;
  }

  try {
    return await createUser({userId, provider});
  } catch (error: unknown) {
    // It's unlikely, but since updating a user is restricted to the controller,
    // we want to guard against a rare race condition where a user attempts
    // to create a user entry that already exists. In such a case, instead of
    // throwing, we retry loading the user data. If that succeeds, it provides
    // a more graceful UX.
    //
    // With the new flow introduced in core library v2, this scenario should
    // never occur, but the handling remains given it was already implemented
    // with the earlier flow where user creation could happen during init.
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
