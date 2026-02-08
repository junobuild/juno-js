import {Browser, BrowserContext, Page} from '@playwright/test';

export interface AppPageParams {
  page: Page;
  context: BrowserContext;
  browser: Browser;
}

export abstract class AppPage {
  protected readonly page: Page;
  protected readonly context: BrowserContext;
  protected readonly browser: Browser;

  protected readonly callToActions = {
    logout: 'Logout',
    add_an_entry: 'Add an entry',
    submit: 'Submit',
    internet_identity: {
      continue: 'Continue with Internet Identity'
    },
    passkey: {
      continue: 'Continue with Passkey',
      create: 'Create a new passkey',
      create_now: 'Create now',
      use: 'Use your Passkey'
    }
  };

  protected readonly locators = {
    open_data: 'a[aria-label="Open data"]',
    delete_entry: 'button[aria-label="Delete entry"]',
    internet_identity: {
      sign_in: `button:has-text("${this.callToActions.internet_identity.continue}")`
    }
  };

  protected constructor({page, context, browser}: AppPageParams) {
    this.page = page;
    this.context = context;
    this.browser = browser;
  }

  waitReady?(): Promise<void>;

  cleanUp?(): Promise<void>;

  abstract signUp(): Promise<void>;

  abstract signIn(): Promise<void>;

  async signOut(): Promise<void> {
    const button = this.page.locator('button', {hasText: this.callToActions.logout});
    await button.click();
  }

  async close(): Promise<void> {
    await this.page.close();
    await this.browser.close();
  }
}
