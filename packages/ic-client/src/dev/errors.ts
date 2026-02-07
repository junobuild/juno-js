export class UnsafeDevIdentityNotBrowserError extends Error {
  constructor() {
    super('A dev identity can only be used in browser environments');
  }
}

export class UnsafeDevIdentityNotLocalhostError extends Error {
  constructor() {
    super('A dev identity must only be used on localhost (127.0.0.1 or localhost)');
  }
}

export class UnsafeDevIdentityInvalidIdentifierError extends Error {
  constructor(length: number) {
    super(`Identifier must be 32 characters or less, got ${length}`);
  }
}
