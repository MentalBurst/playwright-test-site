import {defineConfig, devices} from '@playwright/test';
import {defineBddConfig} from 'playwright-bdd';

const testDir = defineBddConfig({
    paths: ['tests/features/*.feature'],
    import: ['tests/steps/*.ts'],
});

export default defineConfig({
    testDir,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', {outputFolder: 'playwright-report'}],
        ['list'],
    ],
    use: {
        baseURL: 'http://localhost:8080',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        headless: false,
        navigationTimeout: 30000,
        actionTimeout: 10000,
        launchOptions: {
            slowMo: 500,
            args: [
                '--force-device-scale-factor=1.0',
                '--window-size=1880,1100'
            ]
        },
    },
    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },
    ],
    webServer: {
        command: 'npx http-server ./site -p 8080 -c-1',
        port: 8080,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
