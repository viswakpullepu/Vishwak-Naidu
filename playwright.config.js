const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  timeout: 60000, // 60 seconds per test to allow server startup
  use: {
    baseURL: 'http://localhost:8080/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'powershell.exe -ExecutionPolicy Bypass -File server.ps1',
    url: 'http://localhost:8080/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 120 seconds timeout for server to start
  },
});
