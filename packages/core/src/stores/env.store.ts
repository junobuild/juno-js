import type {Environment} from '../types/env';
import {Store} from './_store';

export class EnvStore extends Store<Environment | undefined> {
  private static instance: EnvStore;

  private env: Environment | undefined | null;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!EnvStore.instance) {
      EnvStore.instance = new EnvStore();
    }
    return EnvStore.instance;
  }

  set(env: Environment | undefined) {
    this.env = env;

    this.populate(env);
  }

  get(): Environment | undefined | null {
    return this.env;
  }

  reset() {
    this.env = null;
  }

  override subscribe(callback: (data: Environment | null | undefined) => void): () => void {
    const unsubscribe: () => void = super.subscribe(callback);

    callback(this.env);

    return unsubscribe;
  }
}
