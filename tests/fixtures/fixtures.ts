import { test as base } from 'playwright-bdd';
import { VisualHelper } from '../helpers/VisualHelper';
import { PerformanceHelper } from '../helpers/PerformanceHelper';
import { TestAnalytics } from '../helpers/TestAnalytics';

type CustomFixtures = {
  visualHelper: VisualHelper;
  performanceHelper: PerformanceHelper;
};

export const test = base.extend<CustomFixtures>({
  visualHelper: async ({ page }, use) => {
    const helper = new VisualHelper(page);
    await use(helper);
  },

  performanceHelper: async ({ page }, use) => {
    const helper = new PerformanceHelper(page);
    await use(helper);
    await helper.saveMetrics();
  },
});

// Hook to record test results for analytics
test.afterEach(async ({ page }, testInfo) => {
  const result = {
    name: testInfo.title,
    status: testInfo.status as 'passed' | 'failed' | 'skipped',
    duration: testInfo.duration,
    timestamp: new Date().toISOString(),
    feature: testInfo.file.split(/[/\\]/).pop()?.replace('.feature', '') || 'unknown',
    scenario: testInfo.title,
    error: testInfo.error?.message,
  };

  TestAnalytics.recordTest(result);
});

// Generate analytics dashboard at the end of all tests
test.afterAll(async () => {
  TestAnalytics.generateHTMLReport();
});

export { expect } from '@playwright/test';
