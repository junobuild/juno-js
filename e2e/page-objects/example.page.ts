import {expect} from '@playwright/test';
import {AppPage} from './app.page';

export abstract class ExamplePage extends AppPage {
  async assertSignedIn(): Promise<void> {
    const button = this.page.locator('button', {hasText: this.callToActions.logout});
    await expect(button).toBeVisible();
  }

  async assertSignedOut(): Promise<void> {
    const button = this.page.locator('button', {
      hasText: this.callToActions.internet_identity.continue
    });
    await expect(button).toBeVisible();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async addEntry(text: string): Promise<void> {
    const addEntryButton = this.page.locator('button', {hasText: this.callToActions.add_an_entry});
    await expect(addEntryButton).toBeVisible();

    await addEntryButton.click();

    const textarea = this.page.locator('textarea');
    await textarea.fill(text);

    const button = this.page.locator('button', {hasText: this.callToActions.submit});
    await button.click();

    const row = this.page.locator('[role="row"]', {hasText: text});
    await expect(row).toBeVisible();
  }

  async assertEntries(count: number): Promise<void> {
    const rows = this.page.locator('[role="rowgroup"] [role="row"]');
    await expect(rows).toHaveCount(count, {timeout: 2000});
  }

  async addEntryWithFile({text, filePath}: {text: string; filePath: string}): Promise<void> {
    const addEntryButton = this.page.locator('button', {hasText: this.callToActions.add_an_entry});
    await expect(addEntryButton).toBeVisible();

    await addEntryButton.click();

    const textarea = this.page.locator('textarea');
    await textarea.fill(text);

    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);

    const button = this.page.locator('button', {hasText: this.callToActions.submit});
    await button.click();

    const row = this.page.locator('[role="row"]', {hasText: text});
    await expect(row).toBeVisible({timeout: 60_000});
  }

  async assertUploadedImage(): Promise<void> {
    const [imgPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.locator(this.locators.open_data).click()
    ]);

    await imgPage.waitForLoadState('load');

    await expect(imgPage).toHaveScreenshot('uploaded-image.png', {
      maxDiffPixelRatio: 0.1
    });

    await imgPage.close();
  }

  async deleteLastEntry(): Promise<void> {
    const buttons = this.page.locator(this.locators.delete_entry);
    await buttons.last().click();

    await expect(this.page.locator('[role="row"]', {hasText: 'text'})).toHaveCount(0);
  }

  async assertScreenshot({
    mode,
    name
  }: {
    mode: 'light' | 'dark' | 'current';
    name: string;
  }): Promise<void> {
    await expect(this.page).toHaveScreenshot(`${name}-${mode}-mode.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.03
    });
  }

  async openAddEntry(): Promise<void> {
    const addEntryButton = this.page.locator('button', {hasText: this.callToActions.add_an_entry});
    await expect(addEntryButton).toBeVisible();

    await addEntryButton.click();

    const textarea = this.page.locator('textarea');
    await expect(textarea).toBeVisible();
  }

  async closeAddEntryModal(): Promise<void> {
    const closeAddEntryButton = this.page.locator('button', {hasText: 'Close'});
    await expect(closeAddEntryButton).toBeVisible();

    await closeAddEntryButton.click();
  }
}
