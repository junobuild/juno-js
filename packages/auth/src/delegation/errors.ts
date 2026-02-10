export class InvalidUrlError extends Error {}
export class ContextUndefinedError extends Error {}

export class FedCMIdentityCredentialUndefinedError extends Error {}
export class FedCMIdentityCredentialInvalidError extends Error {}

export class AuthenticationError extends Error {}
export class AuthenticationUrlHashError extends Error {}
export class AuthenticationInvalidStateError extends Error {}
export class AuthenticationUndefinedJwtError extends Error {}

export class GetDelegationError extends Error {}
export class GetDelegationRetryError extends Error {}

export class ApiGitHubInitError extends Error {
  constructor(options?: ErrorOptions) {
    super('GitHub OAuth initialization failed', options);
  }
}

export class ApiGitHubFinalizeError extends Error {
  constructor(options?: ErrorOptions) {
    super('GitHub OAuth finalization failed', options);
  }
}
