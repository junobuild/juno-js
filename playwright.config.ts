import {defineConfig, devices} from '@playwright/test';

const DEV = (process.env.NODE_ENV ?? 'production') === 'development';
const PORT = 5173;

export default defineConfig({
  webServer: [
    {
      command: `npm run dev --prefix demo`,
      reuseExistingServer: true,
      port: PORT
    }
  ],
  testDir: 'e2e',
  testMatch: ['**/*.e2e.ts', '**/*.spec.ts'],
  timeout: 60000,
  use: {
    testIdAttribute: 'data-tid',
    trace: 'on',
    ...(DEV && {headless: false}),
    screenshot: 'only-on-failure',
    baseURL: `http://localhost:${PORT}`
  },
  projects: [
    {
      name: 'Google Chrome',
      use: {...devices['Desktop Chrome'], channel: 'chrome'}
    }
  ],
  workers: process.env.CI ? 1 : undefined,
  snapshotPathTemplate: `{testDir}/__screenshots__/${process.env.NODE_ENV ?? 'production'}/{testFilePath}/{arg}{ext}`
});
