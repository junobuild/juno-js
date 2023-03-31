import type {User} from '../types/auth.types';
import type {Unsubscribe} from '../types/subscription.types';
import {Store} from './store';

export class AuthStore extends Store<User | null> {
  private static instance: AuthStore;

  private authUser: User | null = null;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  set(authUser: User | null) {
    this.authUser = authUser;

    this.populate(authUser);
  }

  get(): User | null {
    return this.authUser;
  }

  override subscribe(callback: (data: User | null) => void): Unsubscribe {
    const unsubscribe: () => void = super.subscribe(callback);

    callback(this.authUser);

    return unsubscribe;
  }

  reset() {
    this.authUser = null;

    this.populate(this.authUser);
  }
}
