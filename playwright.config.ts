import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const SAUCE_DEMO = 'https://www.saucedemo.com';
const RESTFUL_BOOKER = 'https://restful-booker.herokuapp.com';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 7_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0, // retries only in CI, always with a trace
  workers: 2, // public practice sites: stay gentle
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  // Visual checks compare image regions only, so one baseline per browser works on Windows and Linux.
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}{ext}',
  use: {
    baseURL: SAUCE_DEMO,
    testIdAttribute: 'data-test',
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', testDir: './tests/ui', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testDir: './tests/ui', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testDir: './tests/ui', use: { ...devices['Desktop Safari'] } },
    { name: 'api', testDir: './tests/api', use: { baseURL: RESTFUL_BOOKER } },
  ],
});
