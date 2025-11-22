import {isNullish, nonNullish, notEmptyString} from '@dfinity/utils';
import type {BroadcastData} from '../types/auth-broadcast';

// If the user has more than one tab open in the same browser,
// there could be a mismatch of the cached delegation chain vs the identity key of the `authClient` object.
// This causes the `authClient` to be unable to correctly sign calls, raising Trust Errors.
// To mitigate this, we use a `BroadcastChannel` to notify other tabs when a login has occurred, so that they can sync their `authClient` object.
export class AuthBroadcastChannel {
  static #instance: AuthBroadcastChannel | null;

  readonly #bc: BroadcastChannel;
  readonly #emitterId: string;

  static readonly CHANNEL_NAME: BroadcastChannel['name'] = 'juno_core_auth_channel';
  static readonly MESSAGE_LOGIN_SUCCESS = 'authClientLoginSuccess';

  private constructor() {
    this.#bc = new BroadcastChannel(AuthBroadcastChannel.CHANNEL_NAME);
    this.#emitterId = window.crypto.randomUUID();
  }

  static getInstance(): AuthBroadcastChannel {
    if (isNullish(this.#instance)) {
      this.#instance = new AuthBroadcastChannel();
    }

    return this.#instance;
  }

  onLoginSuccess = (handler: () => Promise<void>) => {
    const {
      location: {origin}
    } = window;

    this.#bc.onmessage = async ({origin: eventOrigin, data}) => {
      if (
        eventOrigin === origin &&
        nonNullish(data) &&
        (data as BroadcastData).msg === 'authClientLoginSuccess' &&
        notEmptyString((data as BroadcastData).emitterId) &&
        data.emitterId !== this.#emitterId
      ) {
        await handler();
      }
    };
  };

  destroy = () => {
    this.#bc.close();
    AuthBroadcastChannel.#instance = null;
  };

  postLoginSuccess = () => {
    const data: BroadcastData = {
      emitterId: this.#emitterId,
      msg: AuthBroadcastChannel.MESSAGE_LOGIN_SUCCESS
    };

    this.#bc.postMessage(data);
  };

  get __test__only__emitter_id__(): string {
    return this.#emitterId;
  }
}
