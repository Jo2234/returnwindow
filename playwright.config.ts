import { defineConfig } from '@playwright/test';
export default defineConfig({
    testDir: './tests/e2e', workers: 1, fullyParallel: false, retries: 0, maxFailures: 1,
    timeout: 180000, expect: { timeout: 10000 },
    reporter: [['list']], outputDir: 'test-results/artifacts',
    use: { browserName: 'chromium', headless: true, baseURL: 'http://127.0.0.1:4188', viewport: { width: 1280, height: 800 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
    webServer: { command: 'pnpm build && pnpm preview', url: 'http://127.0.0.1:4188', reuseExistingServer: false, timeout: 120000, gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 } },
});
