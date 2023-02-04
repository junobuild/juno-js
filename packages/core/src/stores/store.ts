export abstract class Store<T> {
  private callbacks: {id: symbol; callback: (data: T | null) => void}[] = [];

  protected populate(data: T | null) {
    this.callbacks.forEach(({callback}: {id: symbol; callback: (data: T | null) => void}) =>
      callback(data)
    );
  }

  subscribe(callback: (data: T | null) => void): () => void {
    const callbackId = Symbol();
    this.callbacks.push({id: callbackId, callback});

    return () =>
      (this.callbacks = this.callbacks.filter(
        ({id}: {id: symbol; callback: (data: T | null) => void}) => id !== callbackId
      ));
  }
}
