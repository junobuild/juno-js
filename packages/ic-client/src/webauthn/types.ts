/**
 * App identity options when creating or retrieving a passkey.
 *
 * This defines how your app is identified to the authenticator.
 * By default, the library infers values from the current
 * browser location (hostname) and document title.
 */
export interface PasskeyAppId {
  /**
   * The domain your passkeys are tied to.
   *
   * For example, it can be `login.example.com` or `example.com`.
   * If set to `example.com`, the passkey will work on any subdomain,
   * such as `login.example.com` or `admin.example.com`.
   *
   * @default The `hostname` of the current URL.
   */
  id?: string;

  /**
   * A human-friendly label for your app shown to the user
   * when creating a passkey.
   *
   * @deprecated This field is deprecated in WebAuthn Level 3 and may be removed in future versions of the implementation.
   * @default The `document.title`.
   */
  name?: string;
}

/**
 * Information shown to the user during passkey creation/sign-in.
 */
export interface PasskeyUser {
  /**
   * A friendly name for the account (e.g. "Maria Sanchez").
   * May be shown in the account selector depending on the browser.
   * Helps the user recognize which passkey belongs to your app.
   *
   * Not required to be unique.
   *
   * You can collect this in information in your user authentication flow.
   * For example, in a wizard or by providing an input field
   * to let users enters a display name.
   *
   * @default The `document.title`.
   */
  displayName: string;

  /**
   * A user-recognizable account identifier to distinguish between accounts
   * that might share the same `displayName` (e.g., email, username, or phone number).
   *
   * @default `displayName`.
   */
  name?: string;
}
/**
 * Options for creating or retrieving a passkey credential.
 */
export interface PasskeyOptions {
  /**
   * Information about your app (called the "relying party" in the spec).
   */
  appId?: PasskeyAppId;
}

/**
 * Options for creating a passkey credential.
 */
export interface CreatePasskeyOptions extends PasskeyOptions {
  /**
   * Information about the user who create the passkey.
   */
  user?: PasskeyUser;
}