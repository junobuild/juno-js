export class CallResponseLengthError extends Error {
  constructor() {
    super();

    this.message = 'More than one object returned by the response. This is unexpected.';
  }
}
