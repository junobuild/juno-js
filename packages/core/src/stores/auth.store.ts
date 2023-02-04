import type {User} from '../types/auth.types';
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

  override subscribe(callback: (data: User | null) => void): () => void {
    const unsubscribe: () => void = super.subscribe(callback);

    callback(this.authUser);

    return unsubscribe;
  }

  isLoggedIn(): boolean {
    return !this.authUser?.data?.principal.isAnonymous();
  }

  reset() {
    this.authUser = null;

    this.populate(this.authUser);
  }
}
