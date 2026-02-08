import {testWithII} from '@dfinity/internet-identity-playwright';
import {AppPageParams} from '../page-objects/app.page';
import {ExampleInternetIdentityPage} from '../page-objects/example.ii.page';
import {ExamplePage} from '../page-objects/example.page';
import {ExamplePasskeyPage} from '../page-objects/example.passkey.page';

export const initTestSuiteWithInternetIdentity = (): (() => ExampleInternetIdentityPage) => {
  return initTestSuite(ExampleInternetIdentityPage.create);
};

export const initTestSuiteWithPasskey = (): (() => ExamplePasskeyPage) => {
  return initTestSuite(ExamplePasskeyPage.create);
};

const initTestSuite = <T extends ExamplePage>(
  create: (params: AppPageParams) => Promise<T>
): (() => T) => {
  let examplePage: T;

  testWithII.beforeAll(async ({playwright}) => {
    testWithII.setTimeout(120000);

    const browser = await playwright.chromium.launch();

    const context = await browser.newContext();
    const page = await context.newPage();

    examplePage = await create({
      page,
      context,
      browser
    });

    await examplePage.waitReady?.();

    await examplePage.goto();

    await examplePage.signUp();
  });

  testWithII.afterAll(async () => {
    await examplePage.cleanUp?.();

    await examplePage.close();
  });

  return (): T => examplePage;
};
