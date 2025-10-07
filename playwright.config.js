// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 300000, // Increased to 5 min per test
  expect: {
    timeout: 15000, // Increased expect timeout
  },

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4, // Adjust based on your system

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"], // keeps console output
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["allure-playwright"], // generates Allure results in ./allure-results
    ["junit", { outputFile: "test-results/results.xml" }], // For CI/CD integration
    ["json", { outputFile: "test-results/results.json" }], // For reporting tools
  ],

  /* Global timeout settings */
  globalTimeout: 300000, // Increased global timeout to 5 min
  maxFailures: process.env.CI ? 0 : 5, // Allow some failures in development

  /* Test Results and Artifacts */
  outputDir: 'test-results/',

  /* Global Test Configuration */
  testMatch: '**/*.{test,spec}.{js,ts}',
  testIgnore: '**/node_modules/**',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CANONICAL_HOSTNAME || "https://hrms.fabhr.in/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    headless: true,

    /* Viewport settings - equivalent to Cypress viewportWidth/viewportHeight */
    viewport: { width: 1920, height: 1080 },

    /* Timeout settings - equivalent to Cypress timeouts */
    navigationTimeout: 80000, // equivalent to pageLoadTimeout
    actionTimeout: 10000, // equivalent to defaultCommandTimeout
    requestTimeout: 10000, // equivalent to requestTimeout
    responseTimeout: 10000, // equivalent to responseTimeout

    /* Security and performance settings */
    ignoreHTTPSErrors: true, // equivalent to chromeWebSecurity: false
    /* Animation handling (equivalent to waitForAnimations) */
    animations: "disabled",

    /* Trace and screenshot settings */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'all-tests',
      testDir: './tests',
    },
    {
      name: 'high-priority',
      testDir: './tests',
      grep: /@high/,
    },
    {
      name: 'medium-priority',
      testDir: './tests',
      grep: /@medium/,
    },
    {
      name: 'low-priority',
      testDir: './tests',
      grep: /@low/,
    },
   
  ],

  /* Web Server for Local Development */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});
