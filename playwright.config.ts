import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/integration',
  testMatch: /.*\.spec\.ts/,
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'msedge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
  webServer: {
    command: 'npm run dev:frontend',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
