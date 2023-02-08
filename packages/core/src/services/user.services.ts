import type {Identity} from '@dfinity/agent';
import type {Principal} from '@dfinity/principal';
import type {User, UserData} from '../types/auth.types';
import {getIdentity} from './auth.services';
import {getDoc, setDoc} from './doc.services';

export const initUser = async (): Promise<User> => {
  const identity: Identity | undefined = getIdentity();

  if (!identity) {
    throw new Error('No internet identity.');
  }

  const userId = identity.getPrincipal().toText();

  const user: User | undefined = await getDoc<UserData>({
    collection: `#user`,
    key: userId
  });

  if (!user) {
    const newUser: User = await createUser({userId, principal: identity.getPrincipal()});
    return newUser;
  }

  return user;
};

const createUser = async ({
  userId,
  principal
}: {
  userId: string;
  principal: Principal;
}): Promise<User> => {
  const now: Date = new Date();

  const data: UserData = {
    principal,
    created_at: now,
    updated_at: now
  };

  return setDoc<UserData>({
    collection: `#user`,
    doc: {
      key: userId,
      data
    }
  });
};
