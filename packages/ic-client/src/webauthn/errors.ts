export class WebAuthnIdentityHostnameError extends Error {}
export class WebAuthnIdentityCredentialNotInitializedError extends Error {}
export class WebAuthnIdentityCreateCredentialOnTheDeviceError extends Error {}
export class WebAuthnIdentityCredentialNotPublicKeyError extends Error {}
export class WebAuthnIdentityNoAttestationError extends Error {}
export class WebAuthnIdentityInvalidCredentialIdError extends Error {}
export class WebAuthnIdentityEncodeCborSignatureError extends Error {}
// https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/authenticatorData
export class WebAuthnIdentityNoAuthenticatorDataError extends Error {}
// https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/signature
export class WebAuthnIdentityNoSignatureError extends Error {}
