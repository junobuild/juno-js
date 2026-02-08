import {CDPSession, expect} from '@playwright/test';
import type {AppPageParams} from './app.page';
import {ExamplePage} from './example.page';

export class ExamplePasskeyPage extends ExamplePage {
  #authenticatorId: string;
  #client: CDPSession;

  private constructor({
    authenticatorId,
    client,
    ...params
  }: AppPageParams & {authenticatorId: string; client: CDPSession}) {
    super(params);

    this.#authenticatorId = authenticatorId;
    this.#client = client;
  }

  static async create({page, ...rest}: AppPageParams): Promise<ExamplePasskeyPage> {
    const client = await page.context().newCDPSession(page);

    await client.send('WebAuthn.enable');

    const {authenticatorId} = await client.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        transport: 'internal',
        hasResidentKey: true,
        hasUserVerification: true,
        // The answer of the authenticator.
        isUserVerified: false,
        // If set to true, the authenticator always answers "yes" whenever it is prompted.
        // We set it to false so that it only triggers explicitly within the suite.
        automaticPresenceSimulation: false
      }
    });

    return new ExamplePasskeyPage({page, authenticatorId, client, ...rest});
  }

  override async cleanUp(): Promise<void> {
    await this.removeAuthenticator();
  }

  override async signUp(): Promise<void> {
    await this.continueWithPasskey();

    // Create a new passkey
    const createPasskeyButton = this.page.locator('button', {
      hasText: this.callToActions.passkey.create
    });
    await expect(createPasskeyButton).toBeVisible();

    await createPasskeyButton.click();

    // Skip providing a specific display name and just create it now
    const createNowPasskeyButton = this.page.locator('button', {
      hasText: this.callToActions.passkey.create_now
    });
    await expect(createNowPasskeyButton).toBeVisible();

    const signUp = async () => await createNowPasskeyButton.click();

    await this.runWithPasskey({action: signUp, withCreation: true});
  }

  override async signIn(): Promise<void> {
    await this.continueWithPasskey();

    // User the existing passkey
    const usePasskeyButton = this.page.locator('button', {
      hasText: this.callToActions.passkey.use
    });
    await expect(usePasskeyButton).toBeVisible();

    const signIn = async () => await usePasskeyButton.click();
    await this.runWithPasskey({action: signIn, withCreation: false});
  }

  private async continueWithPasskey() {
    const continueWithPasskeyButton = this.page.locator('button', {
      hasText: this.callToActions.passkey.continue
    });
    await expect(continueWithPasskeyButton).toBeVisible();

    await continueWithPasskeyButton.click();
  }

  // Source: https://www.corbado.com/blog/passkeys-e2e-playwright-testing-webauthn-virtual-authenticator#612-approach-2-manual-simulation-with-automaticpresencesimulation-set-to-false
  private async runWithPasskey({
    action,
    withCreation
  }: {
    action: () => Promise<void>;
    withCreation: boolean;
  }) {
    const createCompleted = new Promise<void>((resolve) => {
      this.#client.on('WebAuthn.credentialAdded', () => resolve());
    });

    const assertCompleted = new Promise<void>((resolve) => {
      this.#client.on('WebAuthn.credentialAsserted', () => resolve());
    });

    // Any passkey request will be approved by the user
    await this.#client.send('WebAuthn.setUserVerified', {
      authenticatorId: this.#authenticatorId,
      isUserVerified: true
    });

    // Any passkey request will be automatically approved by the simulator
    await this.#client.send('WebAuthn.setAutomaticPresenceSimulation', {
      authenticatorId: this.#authenticatorId,
      enabled: true
    });

    await action();

    withCreation && (await createCompleted);
    await assertCompleted;

    // Back to no automatic approval of passkey by the simulator
    await this.#client.send('WebAuthn.setAutomaticPresenceSimulation', {
      authenticatorId: this.#authenticatorId,
      enabled: false
    });
  }

  private async removeAuthenticator(): Promise<void> {
    await this.#client.send('WebAuthn.removeVirtualAuthenticator', {
      authenticatorId: this.#authenticatorId
    });
  }
}
