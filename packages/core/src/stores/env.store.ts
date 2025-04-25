import type {Environment} from '../types/env.types';
import {Store} from './store';

export class EnvStore extends Store<Environment | undefined> {
  private static instance: EnvStore;

  private env: Environment | undefined;

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

  get(): Environment | undefined {
    return this.env;
  }

  override subscribe(callback: (data: Environment | null | undefined) => void): () => void {
    const unsubscribe: () => void = super.subscribe(callback);

    callback(this.env);

    return unsubscribe;
  }
}
