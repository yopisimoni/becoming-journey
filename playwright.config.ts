import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'off',
  },
  projects: [
    {
      name: 'Mobile Small (320px)',
      use: {
        viewport: { width: 320, height: 640 },
      },
    },
    {
      name: 'Mobile (375px)',
      use: {
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'Tablet (768px)',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Desktop (1440px)',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 3001 -d out',
    port: 3001,
    reuseExistingServer: false,
    timeout: 10000,
  },
});
